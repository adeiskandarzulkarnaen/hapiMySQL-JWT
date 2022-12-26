/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */

const { request } = require('http');
const mysql = require('mysql');
const util = require('util');
const { createAccessToken, decodeToken } = require('./security/TokenManager');

const HISdatabase = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_his',
});
HISdatabase.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MySql telah terkoneksi');
  }
});

// node native promisify
const query = util.promisify(HISdatabase.query).bind(HISdatabase);

// const postData = ()
const login = async (request, h) => {
  try {
    const { username, password } = request.payload;

    const user = await query('SELECT username, password FROM admin WHERE username = ?', [username]);

    if (password !== user[0].password) {
      const response = h.response({
        status: 'failed',
        message: 'Username/Password salah!',
      });
      response.code(401);
      return response;
    }

    const token = createAccessToken({ role: 'admin' });
    const response = h.response({
      status: 'success',
      token,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const createData = async (request, h) => {
  try {
    const { role } = request.auth.credentials;
    if (role !== 'admin') {
      const response = h.response({
        status: 'failed',
        message: 'Anda tidak mempunyai akses resource ini!',
      });
      response.code(403);
      return response;
    }

    const {
      name, age, phoneNumber, address,
    } = request.payload;

    await query('INSERT INTO bio (nama, usia, nohp, alamat) VALUES(?, ?, ?, ?)', [name, age, phoneNumber, address]);
    const response = h.response({
      status: 'succes',
      message: 'Data berhasil ditambahkan!',
    });
    response.code(201);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  createData,
};
