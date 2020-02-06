import { RESTDataSource } from 'apollo-datasource-rest';
import { URLSearchParams } from 'url';
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

export class Api extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://petstore.swagger.io';
  }

  async getPetById({ petId }: QueryGetPetByIdArgs) {
    return this.get(`/pet/${petId}`);
  }

  async updatePetWithForm({ petId, name, status }: MutationUpdatePetWithFormArgs) {
    return this.post(`/pet/${petId}`);
  }

  async deletePet({ api_key, petId }: MutationDeletePetArgs) {
    return this.delete(`/pet/${petId}`);
  }

  async uploadFile({ petId, additionalMetadata, file }: MutationUploadFileArgs) {
    return this.post(`/pet/${petId}/uploadImage`);
  }

  async addPet({ body }: MutationAddPetArgs) {
    return this.post(`/pet`, { body });
  }

  async updatePet({ body }: MutationUpdatePetArgs) {
    return this.put(`/pet`, { body });
  }

  async findPetsByStatus({ status }: QueryFindPetsByStatusArgs) {
    const queries = { status };
    return this.get(`/pet/findByStatus?${new URLSearchParams(queries)}`);
  }

  async findPetsByTags({ tags }: QueryFindPetsByTagsArgs) {
    const queries = { tags };
    return this.get(`/pet/findByTags?${new URLSearchParams(queries)}`);
  }

  async getInventory() {
    return this.get(`/store/inventory`);
  }

  async getOrderById({ orderId }: QueryGetOrderByIdArgs) {
    return this.get(`/store/order/${orderId}`);
  }

  async deleteOrder({ orderId }: MutationDeleteOrderArgs) {
    return this.delete(`/store/order/${orderId}`);
  }

  async placeOrder({ body }: MutationPlaceOrderArgs) {
    return this.post(`/store/order`, { body });
  }

  async getUserByName({ username }: QueryGetUserByNameArgs) {
    return this.get(`/user/${username}`);
  }

  async updateUser({ username, body }: MutationUpdateUserArgs) {
    return this.put(`/user/${username}`, { body });
  }

  async deleteUser({ username }: MutationDeleteUserArgs) {
    return this.delete(`/user/${username}`);
  }

  async loginUser({ username, password }: QueryLoginUserArgs) {
    const queries = { username, password };
    return this.get(`/user/login?${new URLSearchParams(queries)}`);
  }

  async logoutUser() {
    return this.get(`/user/logout`);
  }

  async createUser({ body }: MutationCreateUserArgs) {
    return this.post(`/user`, { body });
  }

  async createUsersWithArrayInput({ body }: MutationCreateUsersWithArrayInputArgs) {
    return this.post(`/user/createWithArray`, { body });
  }

  async createUsersWithListInput({ body }: MutationCreateUsersWithListInputArgs) {
    return this.post(`/user/createWithList`, { body });
  }
}