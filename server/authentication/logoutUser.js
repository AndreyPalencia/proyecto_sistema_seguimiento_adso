import ApiResponse from '../utils/apiResponse.js';

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie('acceso_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', //None
      })
      .status(200)
      .send({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return ApiResponse.error(res, error, 'Error al cerrar sesión');
  }
};
