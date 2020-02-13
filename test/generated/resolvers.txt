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
    getPetById: (parent: Query, args: QueryGetPetByIdArgs, { dataSources }: Context) => {
      return dataSources.api.getPetById(args);
    },
    findPetsByStatus: (parent: Query, args: QueryFindPetsByStatusArgs, { dataSources }: Context) => {
      return dataSources.api.findPetsByStatus(args);
    },
    findPetsByTags: (parent: Query, args: QueryFindPetsByTagsArgs, { dataSources }: Context) => {
      return dataSources.api.findPetsByTags(args);
    },
    getInventory: (parent: Query, args: null, { dataSources }: Context) => {
      return dataSources.api.getInventory();
    },
    getOrderById: (parent: Query, args: QueryGetOrderByIdArgs, { dataSources }: Context) => {
      return dataSources.api.getOrderById(args);
    },
    getUserByName: (parent: Query, args: QueryGetUserByNameArgs, { dataSources }: Context) => {
      return dataSources.api.getUserByName(args);
    },
    loginUser: (parent: Query, args: QueryLoginUserArgs, { dataSources }: Context) => {
      return dataSources.api.loginUser(args);
    },
    logoutUser: (parent: Query, args: null, { dataSources }: Context) => {
      return dataSources.api.logoutUser();
    },
  },
  Mutation: {
    updatePetWithForm: (parent: Mutation, args: MutationUpdatePetWithFormArgs, { dataSources }: Context) => {
      return dataSources.api.updatePetWithForm(args);
    },
    deletePet: (parent: Mutation, args: MutationDeletePetArgs, { dataSources }: Context) => {
      return dataSources.api.deletePet(args);
    },
    uploadFile: (parent: Mutation, args: MutationUploadFileArgs, { dataSources }: Context) => {
      return dataSources.api.uploadFile(args);
    },
    addPet: (parent: Mutation, args: MutationAddPetArgs, { dataSources }: Context) => {
      return dataSources.api.addPet(args);
    },
    updatePet: (parent: Mutation, args: MutationUpdatePetArgs, { dataSources }: Context) => {
      return dataSources.api.updatePet(args);
    },
    deleteOrder: (parent: Mutation, args: MutationDeleteOrderArgs, { dataSources }: Context) => {
      return dataSources.api.deleteOrder(args);
    },
    placeOrder: (parent: Mutation, args: MutationPlaceOrderArgs, { dataSources }: Context) => {
      return dataSources.api.placeOrder(args);
    },
    updateUser: (parent: Mutation, args: MutationUpdateUserArgs, { dataSources }: Context) => {
      return dataSources.api.updateUser(args);
    },
    deleteUser: (parent: Mutation, args: MutationDeleteUserArgs, { dataSources }: Context) => {
      return dataSources.api.deleteUser(args);
    },
    createUser: (parent: Mutation, args: MutationCreateUserArgs, { dataSources }: Context) => {
      return dataSources.api.createUser(args);
    },
    createUsersWithArrayInput: (parent: Mutation, args: MutationCreateUsersWithArrayInputArgs, { dataSources }: Context) => {
      return dataSources.api.createUsersWithArrayInput(args);
    },
    createUsersWithListInput: (parent: Mutation, args: MutationCreateUsersWithListInputArgs, { dataSources }: Context) => {
      return dataSources.api.createUsersWithListInput(args);
    },
  }
}