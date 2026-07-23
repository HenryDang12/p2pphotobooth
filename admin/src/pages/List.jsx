import React, { useState, useEffect } from 'react'
import { backendUrl } from '../App.jsx'
import axios from 'axios'

const List = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/listUser`)
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8">

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-sm uppercase">
                <th className="px-6 py-4 text-center">#</th>
                <th className="px-6 py-4 text-left">Họ tên</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Số điện thoại</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-50 transition-all duration-200`}
                  >
                    <td className="px-6 py-3 text-center font-medium text-blue-600">{index + 1}</td>
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Không có dữ liệu người dùng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default List
