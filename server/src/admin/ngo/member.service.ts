import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import {getMembersByNGOId, updateMemberStatus} from "../../ngo/services/ngo.service";

enum NGOMemberStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REMOVED = "REMOVED"
}

export const getNGOMembersService = async (
  ngoId: string,
  page: number,
  limit: number
) => {
  return getMembersByNGOId({ ngoId, page, limit });
};

export const suspendMemberByAdmin =
  async (memberId: string) => {

    return updateMemberStatus(
      memberId,
      NGOMemberStatus.SUSPENDED
    );
  };

export const reactivateMemberByAdmin =
  async (memberId: string) => {

    return updateMemberStatus(
      memberId,
      NGOMemberStatus.ACTIVE
    );
  };