import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import RegisterForm from '@/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Register | Calculation Tree',
  description: 'Create an account to start calculation discussions',
}

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  // Redirect to home if already logged in
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join the Community
          </h1>
          <p className="text-gray-600">
            Create an account to start your first discussion
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}