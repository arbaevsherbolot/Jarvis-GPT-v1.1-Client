import {
  LoginDto,
  EditMeDto,
  EmailVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto";
import { getCookieValue, setCookie } from "@/lib/utils/cookies";
import instance from "../core/axios";

export const logIn = async (dto: LoginDto) => {
  const existSession = await getCookieValue("session");

  try {
    const { data } = await instance.post("/login", dto);
    const { user, tokens } = data;

    if (!existSession) {
      await setCookie("session", `${tokens.access_token}`);
    }

    return user;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const logOut = async () => {
  try {
    await instance.post("/logout");
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const getMe = async () => {
  try {
    return (await instance.get("/me")).data;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const editMe = async (dto: EditMeDto) => {
  try {
    return (await instance.patch("/me", dto)).data;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const emailVerification = async (dto: EmailVerificationDto) => {
  try {
    return (await instance.post("/email-verification", dto)).data;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const forgotPassword = async (dto: ForgotPasswordDto) => {
  try {
    return (await instance.post("/password/forgot", dto)).data;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};

export const resetPassword = async (dto: ResetPasswordDto) => {
  try {
    return (await instance.post("/password/reset", dto)).data;
  } catch (e: any) {
    throw {
      msg: e.response.data.message,
    };
  }
};
