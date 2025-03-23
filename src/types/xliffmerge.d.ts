declare module '*.json' {
  const value: {
    xliffmergeOptions: {
      srcDir: string;
      genDir: string;
      defaultLanguage: string;
      languages: string[];
      removeUnusedIds: boolean;
      useSourceAsTarget: boolean;
      beautifyOutput: boolean;
    };
  };
  export default value;
}