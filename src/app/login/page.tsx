import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export const metadata: Metadata = {
title: 'Login | Calculation Tree',
description: 'Login to create and participate in calculation discussions',
}

export default async function LoginPage() {
const session = await getServerSession(authOptions)

// Redirect to home if already logged in
if (session) {
redirect('/')
}

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
<div className="max-w-md w-full">
<div className="text-center mb-8">
<h1 className="text-4xl font-bold text-gray-900 mb-2">
Welcome Back
</h1>
<p className="text-gray-600">
Login to continue your calculation journey
</p>
</div>
<LoginForm />
</div>
</div>
)
}