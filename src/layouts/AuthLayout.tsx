import {Outlet, Link} from 'react-router-dom';
import {Trophy} from 'lucide-react';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center">
                    <Trophy className="mx-auto h-12 w-12 text-[var(--frc-blue)]"/>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    OutreachNet
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    The community platform for FRC outreach initiatives
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;