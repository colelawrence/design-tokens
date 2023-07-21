use std::collections::{BTreeMap, BTreeSet, HashMap};

use crate::{
    prelude::*,
    token,
    tokens::{Token, TokenSet},
};

use super::{input, scalars};

#[derive(Debug, Serialize, Codegen)]
#[codegen(tags = "typography-export")]
pub struct TypographyExport {
    properties: Vec<TypographyProperty>,
    tokens: Vec<(TokenSet, Vec<usize>)>,
    /// For example, `{"figma": FigmaTypographyExport, "tailwind": TailwindTypographyExport}`
    extensions: TypographyExtensionExport,
}

impl TypographyExport {
    pub fn as_lookup(&self) -> TokenLookup {
        self.into()
    }
}

pub struct TokenLookup<'a> {
    export: &'a TypographyExport,
    // useful?
    tokens_map: HashMap<Token, Vec<usize>>,
}

impl<'a> From<&'a TypographyExport> for TokenLookup<'a> {
    fn from(value: &'a TypographyExport) -> Self {
        let mut tokens_map: HashMap<Token, Vec<usize>> = HashMap::new();
        for (i, (reqs, _)) in value.tokens.iter().enumerate() {
            for req in reqs.iter() {
                tokens_map.entry(req.clone()).or_default().push(i);
            }
        }
        TokenLookup {
            export: value,
            tokens_map,
        }
    }
}

pub struct TokenQueryOutput<'a> {
    pub properties: Vec<&'a TypographyProperty>,
    /// Used to construct a `"key"` for figuring out which Figma TextStyles to replace.
    pub tokens_required: TokenSet,
}

impl<'a> TokenLookup<'a> {
    pub fn query_with_set(&self, token_set: &TokenSet) -> TokenQueryOutput<'a> {
        let mut found: Vec<(&Vec<usize>, &TokenSet)> = Vec::new();
        for (reqs, prop_idxs) in &self.export.tokens {
            if token_set.contains_all_of(reqs) {
                found.push((prop_idxs, reqs));
            }
        }

        found.sort_unstable_by_key(|&(prec, _)| prec);

        let mut all_reqs = TokenSet::new();
        let mut all_props: Vec<&TypographyProperty> = Vec::new();
        for (idxs, reqs) in found {
            all_reqs.append(reqs.iter());
            for idx in idxs {
                all_props.push(&self.export.properties[*idx]);
            }
        }

        TokenQueryOutput {
            properties: all_props,
            tokens_required: all_reqs,
        }
    }
    pub fn query(&self, tokens: &[Token]) -> TokenQueryOutput<'a> {
        return self.query_with_set(&TokenSet::from(tokens.iter().cloned()));
        // Just in case our logic with sets is flawed...
        // let mut found: Vec<(usize, (&Vec<usize>, &TokenSet))> = Vec::new();
        // 'possible: for (reqs, prop_idxs) in &self.export.tokens {
        //     let mut precedence = None;
        //     for req in reqs.iter() {
        //         match tokens.iter().position(|x| x == &req) {
        //             Some(idx) => {
        //                 precedence = Some(precedence.map_or(idx, |curr| std::cmp::max(curr, idx)))
        //             }
        //             None => continue 'possible,
        //         }
        //     }
        //     if let Some(precedence) = precedence {
        //         found.push((precedence, (prop_idxs, reqs)));
        //     }
        // }

        // found.sort_unstable_by_key(|&(prec, _)| prec);

        // let mut all_reqs = TokenSet::new();
        // let mut all_props: Vec<&TypographyProperty> = Vec::new();
        // for (_, (idxs, reqs)) in found {
        //     all_reqs.append(reqs.iter());
        //     for idx in idxs {
        //         all_props.push(&self.export.properties[*idx]);
        //     }
        // }

        // TokenQueryOutput {
        //     properties: all_props,
        //     tokens_required: all_reqs,
        // }
    }
}

#[derive(Debug, Serialize, Codegen)]
#[codegen(tags = "typography-export")]
#[codegen(scalar)]
#[serde(transparent)]
pub struct TypographyExtensionExport(BTreeMap<String, serde_json::Value>);

#[derive(Default)]
pub struct TypographyTokensCollector(BTreeMap<TokenSet, Vec<TypographyProperty>>);

impl From<TypographyTokensCollector> for TypographyExport {
    fn from(value: TypographyTokensCollector) -> Self {
        let mut result = TypographyExport {
            properties: Vec::new(),
            tokens: Vec::new(),
            extensions: TypographyExtensionExport(BTreeMap::new()),
        };

        for (tokens, values) in value.0.into_iter() {
            let value_idxs = values.into_iter().map(|value| {
                let found_idx_opt = result
                    .properties
                    .iter()
                    .enumerate()
                    .find(|(_, v)| *v == &value)
                    .map(|(idx, _)| idx);
                match found_idx_opt {
                    Some(found_idx) => found_idx,
                    None => {
                        result.properties.push(value);
                        result.properties.len() - 1
                    }
                }
            });

            result.tokens.push((tokens, value_idxs.collect()));
        }

        result
    }
}

#[derive(Debug, Serialize, Clone, Codegen, PartialEq)]
#[codegen(tags = "typography-export")]
pub enum TypographyProperty {
    FontFamily { family_name: Cow<'static, str> },
    LineHeight { px: f64 },
    FontSize { px: f64 },
    LetterSpacing { px: f64 },
    FontStyle(scalars::FontStyleRule),
    // /// Hmm
    // Variable { key: String, value: f64 },
}

impl TypographyTokensCollector {
    fn push(
        &mut self,
        filter: impl IntoIterator<Item = Token>,
        value: TypographyProperty,
    ) -> Result<()> {
        self.push_all(filter, [value])?;
        // self.0.push(TokenValue {
        //     filter: filter.iter().cloned().map(String::from).collect(),
        //     value,
        // });
        Ok(())
    }
    fn push_all(
        &mut self,
        filter: impl IntoIterator<Item = Token>,
        values: impl IntoIterator<Item = TypographyProperty>,
    ) -> Result<()> {
        self.0
            .entry(TokenSet::from(filter))
            .or_default()
            .extend(values);
        // for value in values {
        //     self.push(filter, value);
        // }
        Ok(())
    }
}

pub fn generate_typography_all_tokens(
    input: &input::BaseTypographyInput,
) -> Result<TypographyTokensCollector> {
    let mut all_tokens = TypographyTokensCollector::default();

    let mut role_tokens_by_family_name = BTreeMap::<&str, Vec<Token>>::new();

    for text_role in input.TextRoles.iter() {
        let family_name = Cow::<'static, str>::Owned(text_role.FamilyBaseName.to_string());
        role_tokens_by_family_name
            .entry(&text_role.FamilyBaseName)
            .or_default()
            .push(Token::of_value("role", text_role.Token.clone()));

        let rules = TokenSet::from([
            Token::of_kind("text"),
            Token::of_value("role", text_role.Token.clone()),
        ]);

        all_tokens.push(
            rules.iter(),
            TypographyProperty::FontFamily {
                family_name: family_name.clone(),
            },
        )?;

        let family_info = input.Families.iter().find(|f| f.BaseName.as_str() == &family_name).ok_or_else(|| anyhow::anyhow!("Family name ({family_name:?}) used for text role ({:?}) does not have an entry in `Families`", text_role.Token))?;

        for def_rule in family_info.DefaultRules.iter() {
            all_tokens.push(
                rules.iter(),
                TypographyProperty::FontStyle(def_rule.clone()),
            )?;
        }

        let recip = family_info.Metrics.unitsPerEm / family_info.Metrics.capHeight;

        for size in input.FontSizeScale.FontSizes.iter() {
            let cap_height_px = input
                .FontSizeScale
                .Equation
                .compute_cap_height_px(size.Rel, input.FontSizeScale.AlignCapHeightPxOption);

            let font_size_px = recip * cap_height_px;

            let tracking_px = text_role
                .TrackingRule
                .compute_font_tracking_px(font_size_px);

            let line_height_px = text_role
                .LineHeightRule
                .compute_line_height_px(font_size_px, input.FontSizeScale.AlignLineHeightPxOption);

            all_tokens.push_all(
                rules
                    .iter()
                    .chain(std::iter::once(Token::of_value("size", size.Token.clone()))),
                [
                    TypographyProperty::FontSize { px: font_size_px },
                    TypographyProperty::LetterSpacing { px: tracking_px },
                    TypographyProperty::LineHeight { px: line_height_px },
                ],
            )?;
        }
    }

    for family in input.Families.iter() {
        let role_tokens = match role_tokens_by_family_name.get(family.BaseName.as_str()) {
            Some(roles) => roles,
            None => continue,
        };
        for role_token in role_tokens.iter() {
            for weight in family.Weights.iter() {
                all_tokens.push_all(
                    [
                        role_token.clone(),
                        Token::of_value_display("weight", weight.Weight),
                    ],
                    [TypographyProperty::FontStyle(weight.FontStyleRule.clone())],
                )?;
            }
            if let Some(italic) = &family.ItalicOption {
                all_tokens.push_all(
                    [role_token.clone(), token!("italic:true")],
                    [TypographyProperty::FontStyle(italic.clone())],
                )?;
            }
        }
    }

    Ok(all_tokens)
}
