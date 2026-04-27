import express from "express";
import {
    InviteMember,
    RespondToInvitation,
    RemoveMember,
} from "../controllers/memberController.js";

const router = express.Router();

router.post("/invitations", InviteMember);

router.post("/respond-to-invitation", RespondToInvitation);

router.post("/remove-member", RemoveMember);

export default router;