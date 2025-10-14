export class CreateMaturityQuestionDto {
    id: number;
    standard: string;
    question: string;
    sectionId: number;
    categoryId: number | null;
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
