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
exports.Recipe = exports.CategoryEnum = void 0;
const typeorm_1 = require("typeorm");
const RecipeInstruction_1 = require("./RecipeInstruction");
const RecipeIngredient_1 = require("./RecipeIngredient");
const User_1 = require("./User");
const FavoriteRecipe_1 = require("./FavoriteRecipe");
var CategoryEnum;
(function (CategoryEnum) {
    CategoryEnum["Breakfast"] = "breakfast";
    CategoryEnum["Lunch"] = "lunch";
    CategoryEnum["Dinner"] = "dinner";
    CategoryEnum["Snack"] = "snack";
    CategoryEnum["Dessert"] = "dessert";
    CategoryEnum["Drink"] = "drink";
    CategoryEnum["Soup"] = "soup";
    CategoryEnum["Salad"] = "salad";
    CategoryEnum["Bread"] = "bread";
    CategoryEnum["Sauce"] = "sauce";
    CategoryEnum["IceCream"] = "ice-cream";
    CategoryEnum["FastFood"] = "fast-food";
    CategoryEnum["Sandwich"] = "sandwich";
    CategoryEnum["Other"] = "other";
})(CategoryEnum || (exports.CategoryEnum = CategoryEnum = {}));
let Recipe = class Recipe {
};
exports.Recipe = Recipe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Recipe.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Recipe.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Recipe.prototype, "isVegetarian", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Recipe.prototype, "servings", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Recipe.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'no-image.png' }),
    __metadata("design:type", String)
], Recipe.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CategoryEnum,
        default: CategoryEnum.Other,
    }),
    __metadata("design:type", String)
], Recipe.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RecipeIngredient_1.RecipeIngredient, (ri) => ri.recipe) //recipe in RecipeIngredient
    ,
    __metadata("design:type", Array)
], Recipe.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RecipeInstruction_1.RecipeInstruction, (inst) => inst.recipe),
    __metadata("design:type", Array)
], Recipe.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Recipe.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Recipe.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.recipes, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.User)
], Recipe.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Recipe.prototype, "favCounter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FavoriteRecipe_1.FavoriteRecipe, (fr) => fr.recipe),
    __metadata("design:type", Array)
], Recipe.prototype, "favoritedBy", void 0);
exports.Recipe = Recipe = __decorate([
    (0, typeorm_1.Entity)()
], Recipe);
