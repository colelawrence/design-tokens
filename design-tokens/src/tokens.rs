use crate::prelude::*;
use std::{
    collections::{btree_map, BTreeMap},
    fmt::Display,
};

#[derive(Clone, Hash, PartialEq, Eq, PartialOrd, Ord)]
pub enum Token {
    Kind(Cowstr),
    Value(Cowstr, Cowstr),
}

impl Serialize for Token {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            Token::Kind(kind) => serializer.serialize_str(kind),
            Token::Value(key, value) => serializer.serialize_str(&format!("{key}:{value}")),
        }
    }
}

impl ToString for Token {
    fn to_string(&self) -> String {
        match self {
            Token::Kind(kind) => kind.to_string(),
            Token::Value(key, value) => format!("{key}:{value}"),
        }
    }
}

impl TryFrom<&str> for Token {
    type Error = anyhow::Error;

    fn try_from(input: &str) -> std::result::Result<Self, Self::Error> {
        let mut split = input.split(':');
        match (split.next(), split.next(), split.next()) {
            (Some(kind), None, None) => Ok(Token::Kind(kind.to_string().into())),
            (Some(key), Some(value), None) => Ok(Token::Value(
                key.to_string().into(),
                value.to_string().into(),
            )),
            _ => Err(anyhow::anyhow!(
                "Failed to parse this as a token. We're expecting a value like weight:300, role:ui, or size:sm, but we found {input:?}"
            )),
        }
    }
}

impl std::fmt::Debug for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Kind(arg0) => f.write_fmt(format_args!("#{arg0}")),
            Self::Value(arg0, arg1) => f.write_fmt(format_args!("#{arg0}:{arg1}")),
        }
    }
}

impl Token {
    pub fn of_kind(kind: &'static str) -> Token {
        Token::Kind(kind.into())
    }
    pub fn of_value(key: &'static str, value: impl Into<Cowstr>) -> Token {
        Token::Value(Cow::Borrowed(key), value.into())
    }
    pub fn of_value_display(key: &'static str, from: impl Display) -> Token {
        Token::Value(Cow::Borrowed(key), format!("{}", from).into())
    }
}

#[macro_export]
macro_rules! token {
    ($key:ident: $value:tt) => {
        Token::Value(stringify!($key).into(), stringify!($value).into())
    };
    ($kind:ident) => {
        Token::Kind(stringify!($key).into())
    };
    ($input:expr) => {{
        let mut it = $input.split(':');
        Token::Value(it.next().unwrap().into(), it.next().unwrap().into())
    }};
}

pub use token;

pub fn split_tokens(x: &str) -> Result<Vec<Token>> {
    let trimmed = x.trim();
    if trimmed.is_empty() {
        return Ok(Vec::new());
    }
    trimmed
        .split(|c: char| c.is_whitespace() || c == ',')
        .filter(|s| !s.is_empty())
        .map(|s| Token::try_from(s))
        .collect()
}

#[derive(Clone, Ord, PartialOrd, PartialEq, Eq, Serialize, Deserialize)]
pub struct TokenSet(Option<Cowstr>, BTreeMap<Cowstr, Cowstr>);

impl std::fmt::Debug for TokenSet {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_list().entries(self.iter()).finish()
    }
}

pub struct TokenSetIter<'a>(Option<&'a Cowstr>, btree_map::Iter<'a, Cowstr, Cowstr>);

impl<'a> Iterator for TokenSetIter<'a> {
    type Item = Token;

    fn next(&mut self) -> Option<Self::Item> {
        match self.0.take() {
            Some(value) => Some(Token::Kind(value.clone())),
            None => self
                .1
                .next()
                .map(|(k, v)| Token::Value(k.clone(), v.clone())),
        }
    }
}

impl<I> From<I> for TokenSet
where
    I: IntoIterator<Item = Token>,
{
    fn from(value: I) -> Self {
        let mut start = TokenSet::new();
        start.append(value);
        start
    }
}

#[derive(Debug)]
pub enum MatchErr {
    MissingKind(Cowstr),
    MissingValueOf(Cowstr, Cowstr),
    KindIsDifferent {
        kind_expected: Cowstr,
        kind_found: Cowstr,
    },
    ValueIsDifferent {
        key: Cowstr,
        value_expected: Cowstr,
        value_found: Cowstr,
    },
}

impl TokenSet {
    pub fn new() -> Self {
        TokenSet(None, BTreeMap::new())
    }
    pub fn iter<'a>(&'a self) -> TokenSetIter<'a> {
        TokenSetIter(self.0.as_ref(), self.1.iter())
    }
    pub fn append(&mut self, tok_set: impl IntoIterator<Item = Token>) {
        for tok in tok_set {
            self.insert(tok);
        }
    }
    pub fn with_appended(&self, tok_set: impl IntoIterator<Item = Token>) -> Self {
        let mut created = TokenSet::new();
        for tok in tok_set {
            created.insert(tok);
        }
        created
    }

    pub fn insert(&mut self, tok: Token) -> Option<Token> {
        match tok {
            Token::Kind(key) => self.0.replace(key).map(|old| Token::Kind(old)),
            Token::Value(key, value) => self
                .1
                .insert(key.clone(), value)
                .map(|old| Token::Value(key, old)),
        }
    }

    pub fn contains_all_of(&self, other: &TokenSet) -> bool {
        match (&other.0, &self.0) {
            (None, _) => {}                         // other doesn't require a kind
            (Some(expected), None) => return false, // kind not matched
            (Some(expected), Some(have)) => {
                if expected != have {
                    return false;
                }
            }
        }

        for (key_expected, value_expected) in other.1.iter() {
            match self.1.get(key_expected) {
                Some(found) => {
                    if found != value_expected {
                        return false;
                    }
                }
                None => return false,
            }
        }

        return true;
    }

    pub fn contains_all_of_explained(&self, other: &TokenSet) -> Result<()> {
        let mut errs = Vec::new();
        match (&other.0, &self.0) {
            (None, _) => {} // other doesn't require a kind
            (Some(expected), None) => errs.push(MatchErr::MissingKind(expected.clone())), // kind not matched
            (Some(expected), Some(have)) => {
                if expected != have {
                    errs.push(MatchErr::KindIsDifferent {
                        kind_expected: expected.clone(),
                        kind_found: have.clone(),
                    });
                }
            }
        }

        for (key_expected, value_expected) in other.1.iter() {
            match self.1.get(key_expected) {
                Some(found) => {
                    if found != value_expected {
                        errs.push(MatchErr::ValueIsDifferent {
                            key: key_expected.clone(),
                            value_expected: value_expected.clone(),
                            value_found: found.clone(),
                        })
                    }
                }
                None => errs.push(MatchErr::MissingValueOf(
                    key_expected.clone(),
                    value_expected.clone(),
                )),
            }
        }

        if errs.is_empty() {
            Ok(())
        } else {
            Err(anyhow::anyhow!("Failed to match: {errs:#?}"))
        }
    }
}
