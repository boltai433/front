import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersons } from '../store/slices/personSlice';
import { AppDispatch, RootState } from '../store/store';
import { Users, User } from 'lucide-react';

export default function PersonList() {
  const dispatch = useDispatch<AppDispatch>();
  const { persons, loading, error } = useSelector((state: RootState) => state.person);

  useEffect(() => {
    dispatch(fetchPersons());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Registered Persons</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {persons.map((person) => (
          <div
            key={person.id}
            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <User className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">
                {person.name} {person.lastName}
              </h3>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>Age: {person.age} years</p>
              <p>Weight: {person.weight} kg</p>
              <p>Height: {person.height} m</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}