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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRUDResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const Database_1 = require("./Database");
const errors_1 = require("./errors");
const util_1 = require("./util");
const JSONObject_1 = require("./JSONObject");
function CRUDResolver(ObjectClass, InputClass, objectName, objectNames = `${objectName}s`) {
    let CRUDResolver = 
    // tslint:disable-next-line:no-shadowed-variable
    class CRUDResolver {
        // count
        async count(where) {
            return this.repository.count(util_1.removeBlankKeys({ where }));
        }
        // find all
        async findAll(where, order, skip, take) {
            return this.repository.find(util_1.removeBlankKeys({ where, order, skip, take }));
        }
        // find one
        async findOne(id) {
            const obj = await this.repository.findOne(id);
            if (!obj)
                throw new errors_1.NotFoundError();
            return obj;
        }
        // create new
        async create(input) {
            return this.repository.save(input);
        }
        // update
        async update(id, input) {
            const obj = await this.findOne(id);
            this.repository.merge(obj, input);
            await this.repository.save(obj);
            return obj;
        }
        // delete
        async delete(id) {
            const { affected } = await this.repository.delete(id);
            if (!affected)
                throw new errors_1.NotFoundError();
            return true;
        }
        // the repository
        get repository() {
            return typedi_1.Container.get(Database_1.Database).repository(ObjectClass);
        }
    };
    __decorate([
        type_graphql_1.Query(() => type_graphql_1.Int, { name: `count${objectNames}` }),
        __param(0, type_graphql_1.Arg('filter', () => InputClass, { nullable: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "count", null);
    __decorate([
        type_graphql_1.Query(() => [ObjectClass], { name: `findAll${objectNames}` }),
        __param(0, type_graphql_1.Arg('filter', () => InputClass, { nullable: true })),
        __param(1, type_graphql_1.Arg('sort', () => JSONObject_1.JSONObject, { nullable: true })),
        __param(2, type_graphql_1.Arg('limit', { nullable: true })),
        __param(3, type_graphql_1.Arg('offset', { nullable: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Number, Number]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "findAll", null);
    __decorate([
        type_graphql_1.Query(() => ObjectClass, { name: `findOne${objectName}` }),
        __param(0, type_graphql_1.Arg('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "findOne", null);
    __decorate([
        type_graphql_1.Mutation(() => ObjectClass, { name: `create${objectName}` }),
        __param(0, type_graphql_1.Arg('input', () => InputClass)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "create", null);
    __decorate([
        type_graphql_1.Mutation(() => ObjectClass, { name: `update${objectName}` }),
        __param(0, type_graphql_1.Arg('id')), __param(1, type_graphql_1.Arg('input', () => InputClass)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "update", null);
    __decorate([
        type_graphql_1.Mutation(() => Boolean, { name: `delete${objectName}` }),
        __param(0, type_graphql_1.Arg('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], CRUDResolver.prototype, "delete", null);
    CRUDResolver = __decorate([
        type_graphql_1.Resolver({ isAbstract: true })
        // tslint:disable-next-line:no-shadowed-variable
    ], CRUDResolver);
    return CRUDResolver;
}
exports.CRUDResolver = CRUDResolver;
