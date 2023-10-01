export type SelectedCollection = {
  name: string;
  id: string | null;
};

export type SelectedMode = {
  name: string;
  id: string | null;
};

// Union of messages that can be sent to code.ts
export type CodeMessage =
  | {
      type: 'IMPORT';
      selectedCollection: SelectedCollection;
      selectedMode: SelectedMode;
      body: string;
    }
  | {
      type: 'EXPORT';
    };

export type IframeMessage =
  | {
      type: 'LOAD_COLLECTIONS';
      collections: InternalCollectionsMap;
    }
  | {
      type: 'EXPORT_RESULT';
      files: InternalFile[];
    };

export type Command = 'import' | 'export';

export type InternalFile = {
  fileName: string;
  body: {
    $type?: 'color' | 'number';
    $value?: VariableValue;
  };
};

export type VariableMap = {
  [key: string]: Variable;
};

export type CollectionIdToVariableMap = {
  [collectionId: string]: VariableMap;
};

export type InternalCollectionsMap = {
  [name: string]: {
    name: string;
    id: string;
    defaultModeId: string;
    modes: SelectedMode[];
  };
};
