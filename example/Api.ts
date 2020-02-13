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

  /**
   * @deprecated
   * @tags pet
   * @summary Find pet by ID
   * @description Returns a single pet
   */
  async getPetById({ petId }: QueryGetPetByIdArgs) {
    return this.get(`/pet/${petId}`);
  }

  /**
   * @tags pet
   * @summary Updates a pet in the store with form data
   */
  async updatePetWithForm({ petId, name, status }: MutationUpdatePetWithFormArgs) {
    return this.post(`/pet/${petId}`);
  }

  /**
   * @tags pet
   * @summary Deletes a pet
   */
  async deletePet({ api_key, petId }: MutationDeletePetArgs) {
    return this.delete(`/pet/${petId}`);
  }

  /**
   * @tags pet
   * @summary uploads an image
   */
  async uploadFile({ petId, additionalMetadata, file }: MutationUploadFileArgs) {
    return this.post(`/pet/${petId}/uploadImage`);
  }

  /**
   * @tags pet
   * @summary Add a new pet to the store
   */
  async addPet({ body }: MutationAddPetArgs) {
    return this.post(`/pet`, { body } as { [key: string]: any });
  }

  /**
   * @tags pet
   * @summary Update an existing pet
   */
  async updatePet({ body }: MutationUpdatePetArgs) {
    return this.put(`/pet`, { body } as { [key: string]: any });
  }

  /**
   * @tags pet
   * @summary Finds Pets by status
   * @description Multiple status values can be provided with comma separated strings
   */
  async findPetsByStatus({ status }: QueryFindPetsByStatusArgs) {
    const queries: { [key: string]: any } = { status };
    return this.get(`/pet/findByStatus?${new URLSearchParams(queries)}`);
  }

  /**
   * @deprecated
   * @tags pet
   * @summary Finds Pets by tags
   * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   */
  async findPetsByTags({ tags }: QueryFindPetsByTagsArgs) {
    const queries: { [key: string]: any } = { tags };
    return this.get(`/pet/findByTags?${new URLSearchParams(queries)}`);
  }

  /**
   * @tags store
   * @summary Returns pet inventories by status
   * @description Returns a map of status codes to quantities
   */
  async getInventory() {
    return this.get(`/store/inventory`);
  }

  /**
   * @tags store
   * @summary Find purchase order by ID
   * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   */
  async getOrderById({ orderId }: QueryGetOrderByIdArgs) {
    return this.get(`/store/order/${orderId}`);
  }

  /**
   * @tags store
   * @summary Delete purchase order by ID
   * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   */
  async deleteOrder({ orderId }: MutationDeleteOrderArgs) {
    return this.delete(`/store/order/${orderId}`);
  }

  /**
   * @tags store
   * @summary Place an order for a pet
   */
  async placeOrder({ body }: MutationPlaceOrderArgs) {
    return this.post(`/store/order`, { body } as { [key: string]: any });
  }

  /**
   * @tags user
   * @summary Get user by user name
   */
  async getUserByName({ username }: QueryGetUserByNameArgs) {
    return this.get(`/user/${username}`);
  }

  /**
   * @tags user
   * @summary Updated user
   * @description This can only be done by the logged in user.
   */
  async updateUser({ username, body }: MutationUpdateUserArgs) {
    return this.put(`/user/${username}`, { body } as { [key: string]: any });
  }

  /**
   * @tags user
   * @summary Delete user
   * @description This can only be done by the logged in user.
   */
  async deleteUser({ username }: MutationDeleteUserArgs) {
    return this.delete(`/user/${username}`);
  }

  /**
   * @tags user
   * @summary Logs user into the system
   */
  async loginUser({ username, password }: QueryLoginUserArgs) {
    const queries: { [key: string]: any } = { username, password };
    return this.get(`/user/login?${new URLSearchParams(queries)}`);
  }

  /**
   * @tags user
   * @summary Logs out current logged in user session
   */
  async logoutUser() {
    return this.get(`/user/logout`);
  }

  /**
   * @tags user
   * @summary Create user
   * @description This can only be done by the logged in user.
   */
  async createUser({ body }: MutationCreateUserArgs) {
    return this.post(`/user`, { body } as { [key: string]: any });
  }

  /**
   * @tags user
   * @summary Creates list of users with given input array
   */
  async createUsersWithArrayInput({ body }: MutationCreateUsersWithArrayInputArgs) {
    return this.post(`/user/createWithArray`, { body } as { [key: string]: any });
  }

  /**
   * @tags user
   * @summary Creates list of users with given input array
   */
  async createUsersWithListInput({ body }: MutationCreateUsersWithListInputArgs) {
    return this.post(`/user/createWithList`, { body } as { [key: string]: any });
  }
}