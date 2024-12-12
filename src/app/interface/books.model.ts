export interface Book{
    id: string;
    volumeInfo: {
        title: string;
        authors: Array<string>;
    }
}

export interface JobPosition{
    position: string;
    description: string;
}

export interface JobPositionResponse{
    id: string;
    position: string;
    description: string;
    isActive: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface User{
    firstName: string,
    middleName: string,
    lastName: string,
    password: string,
    username: string,
    email: string,
    jobPositionId: string
}

export interface UserResponse{
    id: string,
    email: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    username: string,
    jobPositionId: string
    jobPosition: string
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ApiResponse<T> {
  data: {
    responseCode: string;
    message: string;
    data: T;
    success?: boolean;
    total?: number;
    page?: number;
    limit?: number;
  };
  }
  
  export interface UserApiResponse{
    access_token: string;
    message: string;
    user: UserResponse;
  }

  export type JobPositionData = ApiResponse<JobPositionResponse[]>;
  export type UserData = UserApiResponse;

  export interface LoginModel {
    usernameOrEmail: string,
    password: string
  }
