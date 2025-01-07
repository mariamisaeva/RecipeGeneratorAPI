"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInstruction = void 0;
const typeorm_1 = require("typeorm");
const Recipe_1 = require("./Recipe");
const Instruction_1 = require("./Instruction");
let RecipeInstruction = class RecipeInstruction {
};
exports.RecipeInstruction = RecipeInstruction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RecipeInstruction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RecipeInstruction.prototype, "stepNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Recipe_1.Recipe, (r) => r.instructions, { onDelete: 'CASCADE' }),
    __metadata("design:type", Recipe_1.Recipe)
], RecipeInstruction.prototype, "recipe", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Instruction_1.Instruction, (i) => i.recipeInstructions),
    __metadata("design:type", Instruction_1.Instruction)
], RecipeInstruction.prototype, "instruction", void 0);
exports.RecipeInstruction = RecipeInstruction = __decorate([
    (0, typeorm_1.Entity)()
], RecipeInstruction);
