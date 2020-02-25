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
    this.baseURL = 'http://petstore.swagger.io/v2';
  }

  /**
   * @deprecated
   * @tags pet
   * @summary Find pet by ID
   * @description Returns a single pet
   * @param {integer} petId - ID of pet to return @path @required
   */
  async getPetById({ petId }: QueryGetPetByIdArgs) {
    return this.get(`/pet/${petId}`);
  }

  /**
   * @tags pet
   * @summary Updates a pet in the store with form data
   * @param {integer} petId - ID of pet that needs to be updated @path @required
   * @param {string} name - Updated name of the pet @formData 
   * @param {string} status - Updated status of the pet @formData 
   */
  async updatePetWithForm({ petId, name, status }: MutationUpdatePetWithFormArgs) {
    return this.post(`/pet/${petId}`, { name, status }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * @tags pet
   * @summary Deletes a pet
   * @param {string} api_key  @header 
   * @param {integer} petId - Pet id to delete @path @required
   */
  async deletePet({ api_key, petId }: MutationDeletePetArgs) {
    return this.delete(`/pet/${petId}`, {
      headers: {
        api_key,
      },
    });
  }

  /**
   * @tags pet
   * @summary uploads an image
   * @param {integer} petId - ID of pet to update @path @required
   * @param {string} additionalMetadata - Additional data to pass to server @formData 
   * @param {file} file - file to upload @formData 
   */
  async uploadFile({ petId, additionalMetadata, file }: MutationUploadFileArgs) {
    return this.post(`/pet/${petId}/uploadImage`);
  }

  /**
   * @tags pet
   * @summary Add a new pet to the store
   * @param {Pet} body - Pet object that needs to be added to the store @body @required
   */
  async addPet({ body }: MutationAddPetArgs) {
    return this.post(`/pet`, { body });
  }

  /**
   * @tags pet
   * @summary Update an existing pet
   * @param {Pet} body - Pet object that needs to be added to the store @body @required
   */
  async updatePet({ body }: MutationUpdatePetArgs) {
    return this.put(`/pet`, { body });
  }

  /**
   * @tags pet
   * @summary Finds Pets by status
   * @description Multiple status values can be provided with comma separated strings
   * @param {string[]} status - Status values that need to be considered for filter @query @required
   */
  async findPetsByStatus({ status }: QueryFindPetsByStatusArgs) {
    const queries = { status };
    return this.get(`/pet/findByStatus?${new URLSearchParams(queries as { [key: string]: any })}`);
  }

  /**
   * @deprecated
   * @tags pet
   * @summary Finds Pets by tags
   * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   * @param {string[]} tags - Tags to filter by @query @required
   */
  async findPetsByTags({ tags }: QueryFindPetsByTagsArgs) {
    const queries = { tags };
    return this.get(`/pet/findByTags?${new URLSearchParams(queries as { [key: string]: any })}`);
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
   * @param {integer} orderId - ID of pet that needs to be fetched @path @required
   */
  async getOrderById({ orderId }: QueryGetOrderByIdArgs) {
    return this.get(`/store/order/${orderId}`);
  }

  /**
   * @tags store
   * @summary Delete purchase order by ID
   * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   * @param {integer} orderId - ID of the order that needs to be deleted @path @required
   */
  async deleteOrder({ orderId }: MutationDeleteOrderArgs) {
    return this.delete(`/store/order/${orderId}`);
  }

  /**
   * @tags store
   * @summary Place an order for a pet
   * @param {Order} body - order placed for purchasing the pet @body @required
   */
  async placeOrder({ body }: MutationPlaceOrderArgs) {
    return this.post(`/store/order`, { body });
  }

  /**
   * @tags user
   * @summary Get user by user name
   * @param {string} username - The name that needs to be fetched. Use user1 for testing.  @path @required
   */
  async getUserByName({ username }: QueryGetUserByNameArgs) {
    return this.get(`/user/${username}`);
  }

  /**
   * @tags user
   * @summary Updated user
   * @description This can only be done by the logged in user.
   * @param {string} username - name that need to be updated @path @required
   * @param {User} body - Updated user object @body @required
   */
  async updateUser({ username, body }: MutationUpdateUserArgs) {
    return this.put(`/user/${username}`, { body });
  }

  /**
   * @tags user
   * @summary Delete user
   * @description This can only be done by the logged in user.
   * @param {string} username - The name that needs to be deleted @path @required
   */
  async deleteUser({ username }: MutationDeleteUserArgs) {
    return this.delete(`/user/${username}`);
  }

  /**
   * @tags user
   * @summary Logs user into the system
   * @param {string} username - The user name for login @query @required
   * @param {string} password - The password for login in clear text @query @required
   */
  async loginUser({ username, password }: QueryLoginUserArgs) {
    const queries = { username, password };
    return this.get(`/user/login?${new URLSearchParams(queries as { [key: string]: any })}`);
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
   * @param {User} body - Created user object @body @required
   */
  async createUser({ body }: MutationCreateUserArgs) {
    return this.post(`/user`, { body });
  }

  /**
   * @tags user
   * @summary Creates list of users with given input array
   * @param {User[]} body - List of user object @body @required
   */
  async createUsersWithArrayInput({ body }: MutationCreateUsersWithArrayInputArgs) {
    return this.post(`/user/createWithArray`, { body });
  }

  /**
   * @tags user
   * @summary Creates list of users with given input array
   * @param {User[]} body - List of user object @body @required
   */
  async createUsersWithListInput({ body }: MutationCreateUsersWithListInputArgs) {
    return this.post(`/user/createWithList`, { body });
  }
}