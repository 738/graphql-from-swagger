export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSON: any,
};

export type ApiResponse = {
   __typename?: 'ApiResponse',
  code?: Maybe<Scalars['Int']>,
  type?: Maybe<Scalars['String']>,
  message?: Maybe<Scalars['String']>,
};

export type Category = {
   __typename?: 'Category',
  id?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};

export type CategoryInput = {
  id?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};


export type Mutation = {
   __typename?: 'Mutation',
  updatePetWithForm: Scalars['JSON'],
  deletePet: Scalars['JSON'],
  uploadFile: ApiResponse,
  addPet: Scalars['JSON'],
  updatePet: Scalars['JSON'],
  /** For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors */
  deleteOrder: Scalars['JSON'],
  placeOrder: Order,
  /** This can only be done by the logged in user. */
  updateUser: Scalars['JSON'],
  /** This can only be done by the logged in user. */
  deleteUser: Scalars['JSON'],
  /** This can only be done by the logged in user. */
  createUser: Scalars['JSON'],
  createUsersWithArrayInput: Scalars['JSON'],
  createUsersWithListInput: Scalars['JSON'],
};


export type MutationUpdatePetWithFormArgs = {
  petId: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>
};


export type MutationDeletePetArgs = {
  api_key?: Maybe<Scalars['String']>,
  petId: Scalars['String']
};


export type MutationUploadFileArgs = {
  petId: Scalars['String'],
  additionalMetadata?: Maybe<Scalars['String']>,
  file?: Maybe<Param_UploadFile_FileInput>
};


export type MutationAddPetArgs = {
  body: PetInput
};


export type MutationUpdatePetArgs = {
  body: PetInput
};


export type MutationDeleteOrderArgs = {
  orderId: Scalars['String']
};


export type MutationPlaceOrderArgs = {
  body: OrderInput
};


export type MutationUpdateUserArgs = {
  username: Scalars['String'],
  body: UserInput
};


export type MutationDeleteUserArgs = {
  username: Scalars['String']
};


export type MutationCreateUserArgs = {
  body: UserInput
};


export type MutationCreateUsersWithArrayInputArgs = {
  body: Array<UserInput>
};


export type MutationCreateUsersWithListInputArgs = {
  body: Array<UserInput>
};

export type Order = {
   __typename?: 'Order',
  id?: Maybe<Scalars['String']>,
  petId?: Maybe<Scalars['String']>,
  quantity?: Maybe<Scalars['Int']>,
  shipDate?: Maybe<Scalars['String']>,
  /** Order Status */
  status?: Maybe<Scalars['String']>,
  complete?: Maybe<Scalars['Boolean']>,
};

export type OrderInput = {
  id?: Maybe<Scalars['String']>,
  petId?: Maybe<Scalars['String']>,
  quantity?: Maybe<Scalars['Int']>,
  shipDate?: Maybe<Scalars['String']>,
  /** Order Status */
  status?: Maybe<Scalars['String']>,
  complete?: Maybe<Scalars['Boolean']>,
};

export type Param_UploadFile_FileInput = {
  unsupported?: Maybe<Scalars['String']>,
};

export type Pet = {
   __typename?: 'Pet',
  id?: Maybe<Scalars['String']>,
  category?: Maybe<Category>,
  name: Scalars['String'],
  photoUrls: Array<Scalars['String']>,
  tags?: Maybe<Array<Pet_Tags_Items>>,
  /** pet status in the store */
  status?: Maybe<Scalars['String']>,
};

export type Pet_Tags_Items = {
   __typename?: 'Pet_tags_items',
  id?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};

export type PetInput = {
  id?: Maybe<Scalars['String']>,
  category?: Maybe<CategoryInput>,
  name: Scalars['String'],
  photoUrls: Array<Scalars['String']>,
  tags?: Maybe<Array<PetInput_TagsInput_ItemsInput>>,
  /** pet status in the store */
  status?: Maybe<Scalars['String']>,
};

export type PetInput_TagsInput_ItemsInput = {
  id?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  /** Returns a single pet */
  getPetById: Pet,
  /** Multiple status values can be provided with comma separated strings */
  findPetsByStatus: Array<Pet>,
  /** Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing. */
  findPetsByTags: Array<Pet>,
  /** Returns a map of status codes to quantities */
  getInventory: Scalars['JSON'],
  /** For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions */
  getOrderById: Order,
  getUserByName: User,
  loginUser: Scalars['String'],
  logoutUser: Scalars['JSON'],
};


export type QueryGetPetByIdArgs = {
  petId: Scalars['String']
};


export type QueryFindPetsByStatusArgs = {
  status: Array<Scalars['String']>
};


export type QueryFindPetsByTagsArgs = {
  tags: Array<Scalars['String']>
};


export type QueryGetOrderByIdArgs = {
  orderId: Scalars['String']
};


export type QueryGetUserByNameArgs = {
  username: Scalars['String']
};


export type QueryLoginUserArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};

export type User = {
   __typename?: 'User',
  id?: Maybe<Scalars['String']>,
  username?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  phone?: Maybe<Scalars['String']>,
  /** User Status */
  userStatus?: Maybe<Scalars['Int']>,
};

export type UserInput = {
  id?: Maybe<Scalars['String']>,
  username?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>,
  phone?: Maybe<Scalars['String']>,
  /** User Status */
  userStatus?: Maybe<Scalars['Int']>,
};
