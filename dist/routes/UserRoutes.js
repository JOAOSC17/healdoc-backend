"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = require("../utils/auth");
const route = express_1.default.Router();
const { users } = new client_1.PrismaClient();
route.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age, email, password: passwordString } = req.body;
        if (!name)
            return res.status(400).json('Name is required');
        if (!age)
            return res.status(400).json('Age is required');
        if (!email)
            return res.status(400).json('Email is required');
        const emailHasBeenUsed = yield users.findUnique({
            where: {
                email
            }
        });
        if (emailHasBeenUsed)
            return res.status(403).json('Email has been used by another person');
        if (!passwordString)
            return res.status(400).json('Password is required');
        const password = yield bcrypt.hash(passwordString, 10);
        const newUser = yield users.create({
            data: { name, age, email, password }
        });
        const token = jwt.sign({ userId: newUser.id }, auth_1.APP_SECRET);
        console.log(newUser);
        res.status(200).json({
            token,
            newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}));
route.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email)
            return res.status(400).json('Email is required');
        const user = yield users.findUnique({
            where: {
                email
            }
        });
        if (!user)
            return res.status(403).json("Email hasn't been resgistered");
        if (!password)
            return res.status(400).json('Password is required');
        const valid = yield bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user.id }, auth_1.APP_SECRET);
        res.status(200).json({
            token,
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}));
exports.default = route;
