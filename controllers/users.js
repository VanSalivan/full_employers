const { prisma } = require("../prisma/prisma-client");
const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

/** 
@route POST api/user/login
@desc Логин
@access Public
*/
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните обязательные поля" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const isPasswordCorrect =
    user && (await brypt.compare(password, user.password));

  if (user && isPasswordCorrect && secret) {
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
    });
  } else {
    return res.status(400).json({
      message: "Неверно введен логин или пароль",
    });
  }
};

/** 
@route POST api/user/register
@desc Регистрация
@access Public
*/
const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Заполните обязательные поля" });
  }
  // Проверка на наличие пользователя в базе данных
  const registerUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (registerUser) {
    return res
      .status(400)
      .json({ message: "Пользователь с таким email уже существует" });
  }

  const salt = await brypt.genSalt(10);
  const hashedPassord = await brypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassord,
    },
  });

  if (user && secret) {
    res.status(201).json({
      id: user.id,
      email: user.email,
      name,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
    });
  } else {
    return res.status(400).json({ message: "Не удалось создать пользователя" });
  }
};

/** 
@route GET api/user/current
@desc Текуший пользователь
@access Private
*/
const current = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
