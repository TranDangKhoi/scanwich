import { ROLE } from "src/constants/types.constants";
import z from "zod";

export const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([ROLE.Owner, ROLE.Employee]),
  avatar: z.string().nullable(),
});

export type TAccount = z.TypeOf<typeof accountSchema>;

export const accountResSchema = z.object({
  data: accountSchema,
  message: z.string(),
});

export type TAccountRes = z.TypeOf<typeof accountResSchema>;

export const accountListResSchema = z.object({
  data: z.array(accountSchema),
  message: z.string(),
});

export type TAccountListRes = z.TypeOf<typeof accountListResSchema>;

export const createEmployeeAccountBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên người dùng cần có ít nhất 2 ký tự")
      .max(256, "Tên người dùng không được vượt quá 256 ký tự"),
    email: z.string().email("Định dạng e-mail không hợp lệ"),
    avatar: z
      .union([z.string().url(), z.instanceof(File)])
      .optional()
      .nullable(),
    password: z.string().min(6, "Mật khẩu cần có ít nhất 6 ký tự").max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu xác nhận cần có ít nhất 6 ký tự")
      .max(100, "Mật khẩu xác nhận không được vượt quá 100 ký tự"),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu xác thực không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type TCreateEmployeeAccountBody = z.TypeOf<typeof createEmployeeAccountBodySchema>;

export const updateEmployeeAccountBodySchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z
      .union([z.string().url(), z.instanceof(File)])
      .optional()
      .nullable(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.enum([ROLE.Owner, ROLE.Employee]).optional().default(ROLE.Employee),
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu mới và xác nhận mật khẩu mới",
          path: ["changePassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Mật khẩu không khớp",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type TUpdateEmployeeAccountBody = z.TypeOf<typeof updateEmployeeAccountBodySchema>;

export const updateMeBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên người dùng cần có ít nhất hai ký tự")
      .max(256, "Tên người dùng không được vượt quá 256 ký tự"),
    avatar: z
      .union([z.string().url(), z.instanceof(File)])
      .optional()
      .nullable(),
  })
  .strict();

export type TUpdateMeBody = z.TypeOf<typeof updateMeBodySchema>;

export const changePasswordBodySchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Mật khẩu cũ của bạn cần phải có nhiều hơn 6 ký tự")
      .max(100, "Mật khẩu cũ của bạn không được vượt quá 100 ký tự"),
    password: z
      .string()
      .min(6, "Mật khẩu mới cần phải có nhiều hơn 6 ký tự")
      .max(100, "Mật khẩu mới không được vượt quá 100 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu xác nhận cần phải có nhiều hơn 6 ký tự")
      .max(100, "Mật khẩu xác nhận không được vượt quá 100 ký tự"),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu mới không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type TChangePasswordBody = z.TypeOf<typeof changePasswordBodySchema>;

export const accountIdParamSchema = z.object({
  id: z.coerce.number(),
});

export type TAccountIdParam = z.TypeOf<typeof accountIdParamSchema>;

export const guestSchema = z.object({
  id: z.number(),
  name: z.string(),
  tableNumber: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const guestListResSchema = z.object({
  data: z.array(guestSchema),
  message: z.string(),
});

export type TGuestListRes = z.TypeOf<typeof guestListResSchema>;

export const guestListQueryParamsSchema = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type TGuestListQueryParams = z.TypeOf<typeof guestListQueryParamsSchema>;

export const createGuestBodySchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    tableNumber: z.number(),
  })
  .strict();

export type TCreateGuestBody = z.TypeOf<typeof createGuestBodySchema>;

export const createGuestResSchema = z.object({
  message: z.string(),
  data: guestSchema.extend({ role: z.enum([ROLE.Guest]) }),
});

export type TCreateGuestRes = z.TypeOf<typeof createGuestResSchema>;
