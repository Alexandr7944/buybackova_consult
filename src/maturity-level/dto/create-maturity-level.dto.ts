export class CreateMaturityQuestionDto {
    id: number;
    standard: string;
    question: string;
    sectionId: number;
    categoryId: number | null;
    toolId: number | null;
}

export class CreateMaturitySectionDto {
    id: number;
    title: string;
    rows?: Array<number>;
}

export class CreateMaturityCategoryDto {
    id: number;
    title: string;
    questions?: Array<number>;
}

export class CreateMaturityToolDto {
    id: number;
    title: string;
    questions?: Array<number>;
}
