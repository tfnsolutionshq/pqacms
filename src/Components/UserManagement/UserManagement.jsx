
import React, { useMemo, useState } from 'react'
import { Search, ChevronDown, UserPlus, Mail, Phone, Edit, ShieldCheck, Trash2, X } from 'lucide-react'

function UserManagement() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: '' })
  const [users, setUsers] = useState([
    {
      name: 'Admin User',
      email: 'admin@turboflux.com',
      phone: '+234 800 000 0001',
      role: 'Admin',
      permissions: ['All'],
      status: 'Active',
      twoFA: true,
    },
    {
      name: 'John Adeyemi',
      email: 'john.a@turboflux.com',
      phone: '+234 800 000 0002',
      role: 'Driver',
      permissions: ['View', 'Update Delivery'],
      status: 'Active',
      twoFA: false,
    },
    {
      name: 'Sarah Ibrahim',
      email: 'sarah.i@turboflux.com',
      phone: '+234 800 000 0003',
      role: 'Depot Manager',
      permissions: ['Manage Loading', 'Lock Control'],
      status: 'Active',
      twoFA: true,
    },
    {
      name: 'Michael Okafor',
      email: 'michael.o@turboflux.com',
      phone: '+234 800 000 0004',
      role: 'Station Manager',
      permissions: ['Request Unlock', 'Confirm Delivery'],
      status: 'Active',
      twoFA: false,
    },
    {
      name: 'Grace Okoro',
      email: 'grace.o@turboflux.com',
      phone: '+234 800 000 0005',
      role: 'Security Officer',
      permissions: ['View Alerts', 'Monitor'],
      status: 'Active',
      twoFA: true,
    },
  ])

  const roleOptions = ['All Roles', 'Admin', 'Driver', 'Depot Manager', 'Station Manager', 'Security Officer']

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesQuery = [u.name, u.email, u.phone, u.role].some(v => v.toLowerCase().includes(query.toLowerCase()))
      const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter
      return matchesQuery && matchesRole
    })
  }, [users, query, roleFilter])

  const toggleTwoFA = (index) => {
    setUsers(prev => prev.map((u, i) => i === index ? { ...u, twoFA: !u.twoFA } : u))
  }

  const renderRoleBadge = (role) => {
    const map = {
      'Admin': 'bg-purple-100 text-purple-700',
      'Driver': 'bg-green-100 text-green-700',
      'Depot Manager': 'bg-blue-100 text-blue-700',
      'Station Manager': 'bg-orange-100 text-orange-700',
      'Security Officer': 'bg-red-100 text-red-700',
    }
    const cls = map[role] || 'bg-gray-100 text-gray-700'
    return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{role}</span>
  }

  const renderPermissionBadge = (perm) => {
    return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 mr-1">{perm}</span>
  }

  const handleOpenCreate = () => setShowCreateModal(true)
  const handleCloseCreate = () => {
    setShowCreateModal(false)
    setNewUser({ name: '', email: '', phone: '', role: '' })
  }

  const handleAddUser = (e) => {
    e?.preventDefault?.()
    // Basic required check; you can expand later
    const { name, email, phone, role } = newUser
    if (!name || !email || !phone || !role) {
      return
    }
    setUsers(prev => [
      ...prev,
      {
        name,
        email,
        phone,
        role,
        permissions: ['View'],
        status: 'Active',
        twoFA: false,
      },
    ])
    handleCloseCreate()
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-600">Manage system users, roles, and permissions</p>
        </div>
        <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-amber-600 shadow-sm hover:opacity-95">
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div className="relative w-40">
            <button
              onClick={() => setShowRoleMenu(v => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>{roleFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-md">
                {roleOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setRoleFilter(opt); setShowRoleMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${opt === roleFilter ? 'bg-gray-50' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table (desktop) */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">All Users ({filteredUsers.length})</h2>
            <p className="text-xs text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Permissions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">2FA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.email} className="hover:bg-gray-50">
                    {/* Name */}
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{u.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{u.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-sm">{renderRoleBadge(u.role)}</td>

                    {/* Permissions */}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-center gap-1">
                        {u.permissions.map(p => (
                          <span key={p}>{renderPermissionBadge(p)}</span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{u.status}</span>
                    </td>

                    {/* 2FA */}
                    <td className="px-4 py-3 text-sm">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={u.twoFA} onChange={() => toggleTwoFA(idx)} />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors">
                          <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${u.twoFA ? 'translate-x-5' : ''}`} />
                        </div>
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg text-green-600 hover:bg-green-50"><ShieldCheck className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Users Cards (mobile) */}
      <div className="md:hidden">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">All Users ({filteredUsers.length})</h2>
            <p className="text-xs text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div className="p-3 space-y-3">
            {filteredUsers.map((u, idx) => (
              <div key={u.email} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-600">{u.role}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{u.status}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" />{u.email}</div>
                  <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-gray-400" />{u.phone}</div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1">
                  {u.permissions.map(p => (
                    <span key={p} className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">{p}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={u.twoFA} onChange={() => toggleTwoFA(idx)} />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors">
                      <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${u.twoFA ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-green-600 hover:bg-green-50"><ShieldCheck className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseCreate} />
          {/* Modal */}
          <div className="relative z-[61] w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Add New User</h3>
                <p className="mt-1 text-sm text-slate-600">Create a new user account and assign role and permissions.</p>
              </div>
              <button onClick={handleCloseCreate} className="p-2 rounded-md hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="px-6 pb-6 pt-4 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-slate-800">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(v => ({ ...v, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-800">Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="user@turboflux.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser(v => ({ ...v, email: e.target.value }))}
                    className="w-full pl-10 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-slate-800">Phone Number</label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(v => ({ ...v, phone: e.target.value }))}
                    className="w-full pl-10 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Role */}
              <div>
                <label className="text-sm font-medium text-slate-800">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(v => ({ ...v, role: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select role</option>
                  {roleOptions.filter(r => r !== 'All Roles').map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={handleCloseCreate} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:opacity-95">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement