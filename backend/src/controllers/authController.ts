class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password, role, name } = req.body;
      const result = await userService.registration(
        email,
        password,
        role,
        name
      );

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
