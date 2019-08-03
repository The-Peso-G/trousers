import { StyleDefinition, Predicate, Expression } from './types';
import { generateHash } from './common';

export class StyleCollector<Props, State, Theme> {
    private styleDefinitions: StyleDefinition<Props, State, Theme>[] = [];

    constructor(private elementName: string) {}

    element(styles: TemplateStringsArray, ...expressions: Expression<Theme>[]) {
        return this.registerStyles(styles, expressions, '__');
    }

    modifier(predicate: Predicate<Props, State>) {
        return (
            styles: TemplateStringsArray,
            ...expressions: Expression<Theme>[]
        ) => this.registerStyles(styles, expressions, '--', predicate);
    }

    getElementName() {
        return this.elementName;
    }

    get(): StyleDefinition<Props, State, Theme>[] {
        return this.styleDefinitions;
    }

    private registerStyles(
        styles: TemplateStringsArray,
        expressions: Expression<Theme>[],
        separator: string,
        predicate: Predicate<Props, State> = () => true,
    ) {
        const key = styles.reduce((accum, style) => `${accum}${style}`, '');
        const hash = generateHash(key);

        this.styleDefinitions.push({
            hash,
            styles,
            expressions,
            predicate,
            separator,
        });

        return this;
    }
}

export default function styleCollector<Props, State, Theme>(
    elementName: string,
) {
    return new StyleCollector<Props, State, Theme>(elementName);
}
