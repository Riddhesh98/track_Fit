import UserLayout from "../components/UserLayout";


const UserDashboard = () => {
  return (
    <UserLayout active="dashboard">
      <div className="p-6">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-gray-500">Here is your daily overview.</p>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
