import { GraphQLResolveInfo } from 'graphql';
import {
  Query,
  Mutation,
  QueryGetPetByIdArgs,
  MutationUpdatePetWithFormArgs,
  MutationDeletePetArgs,
  MutationUploadFileArgs,
  MutationAddPetArgs,
  MutationUpdatePetArgs,
  QueryFindPetsByStatusArgs,
  QueryFindPetsByTagsArgs,
  QueryGetOrderByIdArgs,
  MutationDeleteOrderArgs,
  MutationPlaceOrderArgs,
  QueryGetUserByNameArgs,
  MutationUpdateUserArgs,
  MutationDeleteUserArgs,
  QueryLoginUserArgs,
  MutationCreateUserArgs,
  MutationCreateUsersWithArrayInputArgs,
  MutationCreateUsersWithListInputArgs
} from './types';
import { Api } from './Api';

type DataSources = {
  api: Api;
};
type Context = {
  dataSources: DataSources;
};

export const resolvers = {
  Query: {
    getPetById: (parent: Query, args: QueryGetPetByIdArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.getPetById(args);
    },
    findPetsByStatus: (parent: Query, args: QueryFindPetsByStatusArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.findPetsByStatus(args);
    },
    findPetsByTags: (parent: Query, args: QueryFindPetsByTagsArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.findPetsByTags(args);
    },
    getInventory: (parent: Query, args: null, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.getInventory();
    },
    getOrderById: (parent: Query, args: QueryGetOrderByIdArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.getOrderById(args);
    },
    getUserByName: (parent: Query, args: QueryGetUserByNameArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.getUserByName(args);
    },
    loginUser: (parent: Query, args: QueryLoginUserArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.loginUser(args);
    },
    logoutUser: (parent: Query, args: null, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.logoutUser();
    },
  },
  Mutation: {
    updatePetWithForm: (parent: Mutation, args: MutationUpdatePetWithFormArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.updatePetWithForm(args);
    },
    deletePet: (parent: Mutation, args: MutationDeletePetArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.deletePet(args);
    },
    uploadFile: (parent: Mutation, args: MutationUploadFileArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.uploadFile(args);
    },
    addPet: (parent: Mutation, args: MutationAddPetArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.addPet(args);
    },
    updatePet: (parent: Mutation, args: MutationUpdatePetArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.updatePet(args);
    },
    deleteOrder: (parent: Mutation, args: MutationDeleteOrderArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.deleteOrder(args);
    },
    placeOrder: (parent: Mutation, args: MutationPlaceOrderArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.placeOrder(args);
    },
    updateUser: (parent: Mutation, args: MutationUpdateUserArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.updateUser(args);
    },
    deleteUser: (parent: Mutation, args: MutationDeleteUserArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.deleteUser(args);
    },
    createUser: (parent: Mutation, args: MutationCreateUserArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.createUser(args);
    },
    createUsersWithArrayInput: (parent: Mutation, args: MutationCreateUsersWithArrayInputArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.createUsersWithArrayInput(args);
    },
    createUsersWithListInput: (parent: Mutation, args: MutationCreateUsersWithListInputArgs, context: Context, info: GraphQLResolveInfo) => {
      return context.dataSources.api.createUsersWithListInput(args);
    },
  }
}