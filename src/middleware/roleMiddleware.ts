export const requireAdmin = (user: any) => {
    if (user?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
    }
};