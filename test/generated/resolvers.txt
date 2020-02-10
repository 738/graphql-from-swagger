import {
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

export const resolvers = {
  Query: {
    getPetById: (_: any, args: QueryGetPetByIdArgs, { dataSources }: any) => {
      return dataSources.api.getPetById(args);
    },
    findPetsByStatus: (_: any, args: QueryFindPetsByStatusArgs, { dataSources }: any) => {
      return dataSources.api.findPetsByStatus(args);
    },
    findPetsByTags: (_: any, args: QueryFindPetsByTagsArgs, { dataSources }: any) => {
      return dataSources.api.findPetsByTags(args);
    },
    getInventory: (_: any, args: any, { dataSources }: any) => {
      return dataSources.api.getInventory();
    },
    getOrderById: (_: any, args: QueryGetOrderByIdArgs, { dataSources }: any) => {
      return dataSources.api.getOrderById(args);
    },
    getUserByName: (_: any, args: QueryGetUserByNameArgs, { dataSources }: any) => {
      return dataSources.api.getUserByName(args);
    },
    loginUser: (_: any, args: QueryLoginUserArgs, { dataSources }: any) => {
      return dataSources.api.loginUser(args);
    },
    logoutUser: (_: any, args: any, { dataSources }: any) => {
      return dataSources.api.logoutUser();
    },
  },
  Mutation: {
    updatePetWithForm: (_: any, args: MutationUpdatePetWithFormArgs, { dataSources }: any) => {
      return dataSources.api.updatePetWithForm(args);
    },
    deletePet: (_: any, args: MutationDeletePetArgs, { dataSources }: any) => {
      return dataSources.api.deletePet(args);
    },
    uploadFile: (_: any, args: MutationUploadFileArgs, { dataSources }: any) => {
      return dataSources.api.uploadFile(args);
    },
    addPet: (_: any, args: MutationAddPetArgs, { dataSources }: any) => {
      return dataSources.api.addPet(args);
    },
    updatePet: (_: any, args: MutationUpdatePetArgs, { dataSources }: any) => {
      return dataSources.api.updatePet(args);
    },
    deleteOrder: (_: any, args: MutationDeleteOrderArgs, { dataSources }: any) => {
      return dataSources.api.deleteOrder(args);
    },
    placeOrder: (_: any, args: MutationPlaceOrderArgs, { dataSources }: any) => {
      return dataSources.api.placeOrder(args);
    },
    updateUser: (_: any, args: MutationUpdateUserArgs, { dataSources }: any) => {
      return dataSources.api.updateUser(args);
    },
    deleteUser: (_: any, args: MutationDeleteUserArgs, { dataSources }: any) => {
      return dataSources.api.deleteUser(args);
    },
    createUser: (_: any, args: MutationCreateUserArgs, { dataSources }: any) => {
      return dataSources.api.createUser(args);
    },
    createUsersWithArrayInput: (_: any, args: MutationCreateUsersWithArrayInputArgs, { dataSources }: any) => {
      return dataSources.api.createUsersWithArrayInput(args);
    },
    createUsersWithListInput: (_: any, args: MutationCreateUsersWithListInputArgs, { dataSources }: any) => {
      return dataSources.api.createUsersWithListInput(args);
    },
  }
}