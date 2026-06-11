/**
 * mockData.js
 * 
 * Purpose: Mock data for CivilEye development and demonstration
 * 
 * Responsibilities:
 * - Provide sample complaint data
 * - Simulate realistic civic issues
 * - Include various statuses and priorities
 * - Supply test data for development
 * 
 * How it works:
 * - Exports arrays of mock complaints, comments, users
 * - Used by API service to simulate backend responses
 * - Contains diverse issue types and locations
 * 
 * Data Structure:
 * - Complaints: Full complaint objects with all fields
 * - Comments: User comments on complaints
 * - Users: Sample citizen and admin users
 * 
 * CivilEye Context:
 * This mock data enables development and testing of the CivilEye
 * platform without requiring a backend API. In production, this
 * would be replaced with real API calls.
 */

/**
 * Mock Complaints Data
 * Represents realistic civic issues reported by citizens
 */
export const mockComplaints = [
  {
    id: 1,
    title: 'Large pothole on Main Street',
    description: 'There is a significant pothole near the intersection of Main Street and 5th Avenue. It poses a danger to vehicles and cyclists.',
    issueType: 'pothole',
    status: 'in-progress',
    priority: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Main Street & 5th Avenue'
    },
    reportedBy: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    assignedTo: 'Road Maintenance Department',
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-22T14:20:00Z',
    upvotes: 45,
    comments: 12
  },
  {
    id: 2,
    title: 'Blocked drainage system',
    description: 'The drainage on Oak Street is completely blocked, causing water accumulation during rain.',
    issueType: 'drainage',
    status: 'pending',
    priority: 'critical',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: 'Oak Street, Block 42'
    },
    reportedBy: {
      id: 3,
      name: 'Test User',
      email: 'user@test.com'
    },
    assignedTo: null,
    createdAt: '2026-01-22T08:15:00Z',
    updatedAt: '2026-01-22T08:15:00Z',
    upvotes: 78,
    comments: 23
  },
  {
    id: 3,
    title: 'Street light not working',
    description: 'The street light at the corner of Elm Street has not been working for over a week, making the area dark and unsafe at night.',
    issueType: 'streetlight',
    status: 'assigned',
    priority: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: 'Elm Street Corner'
    },
    reportedBy: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    assignedTo: 'Electrical Services',
    createdAt: '2026-01-18T16:45:00Z',
    updatedAt: '2026-01-21T09:30:00Z',
    upvotes: 34,
    comments: 8
  },
  {
    id: 4,
    title: 'Fallen tree blocking sidewalk',
    description: 'A large tree has fallen and is completely blocking the sidewalk on Park Avenue. Pedestrians are forced to walk on the road.',
    issueType: 'fallen-tree',
    status: 'resolved',
    priority: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800',
    location: {
      lat: 40.7356,
      lng: -74.0123,
      address: 'Park Avenue, near Central Park'
    },
    reportedBy: {
      id: 2,
      name: 'Admin User',
      email: 'admin@civileye.com'
    },
    assignedTo: 'Parks and Recreation',
    createdAt: '2026-01-15T07:20:00Z',
    updatedAt: '2026-01-16T15:00:00Z',
    upvotes: 92,
    comments: 15
  },
  {
    id: 5,
    title: 'Road blockage due to construction debris',
    description: 'Construction debris has been left on the road, blocking one lane and causing traffic congestion.',
    issueType: 'road-blockage',
    status: 'pending',
    priority: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: 'Broadway & 42nd Street'
    },
    reportedBy: {
      id: 3,
      name: 'Test User',
      email: 'user@test.com'
    },
    assignedTo: null,
    createdAt: '2026-01-23T11:00:00Z',
    updatedAt: '2026-01-23T11:00:00Z',
    upvotes: 56,
    comments: 9
  },
  {
    id: 6,
    title: 'Multiple potholes on residential street',
    description: 'Several potholes have formed on Cedar Lane, a residential street with heavy daily traffic.',
    issueType: 'pothole',
    status: 'assigned',
    priority: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1621544305891-0cd9d8f58d7b?w=800',
    location: {
      lat: 40.7282,
      lng: -74.0776,
      address: 'Cedar Lane'
    },
    reportedBy: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    assignedTo: 'Road Maintenance Department',
    createdAt: '2026-01-19T13:30:00Z',
    updatedAt: '2026-01-20T10:15:00Z',
    upvotes: 28,
    comments: 5
  },
  {
    id: 7,
    title: 'Overflowing drainage causing flooding',
    description: 'The drainage system is overflowing every time it rains, causing significant flooding in the area.',
    issueType: 'drainage',
    status: 'in-progress',
    priority: 'critical',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    location: {
      lat: 40.7410,
      lng: -73.9897,
      address: 'Riverside Drive'
    },
    reportedBy: {
      id: 3,
      name: 'Test User',
      email: 'user@test.com'
    },
    assignedTo: 'Water Management',
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-01-23T08:30:00Z',
    upvotes: 103,
    comments: 27
  },
  {
    id: 8,
    title: 'Broken street light near school',
    description: 'The street light in front of Lincoln Elementary School is broken, creating safety concerns for children.',
    issueType: 'streetlight',
    status: 'resolved',
    priority: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    location: {
      lat: 40.7529,
      lng: -73.9821,
      address: 'School Street, Lincoln Elementary'
    },
    reportedBy: {
      id: 2,
      name: 'Admin User',
      email: 'admin@civileye.com'
    },
    assignedTo: 'Electrical Services',
    createdAt: '2026-01-17T14:20:00Z',
    updatedAt: '2026-01-19T16:45:00Z',
    upvotes: 67,
    comments: 11
  }
]

/**
 * Mock Comments Data
 * User comments on complaints
 */
export const mockComments = {
  1: [
    {
      id: 1,
      complaintId: 1,
      user: { id: 3, name: 'Test User' },
      text: 'I drive through here every day. This pothole is getting worse!',
      createdAt: '2026-01-20T12:00:00Z'
    },
    {
      id: 2,
      complaintId: 1,
      user: { id: 2, name: 'Admin User' },
      text: 'Issue has been assigned to Road Maintenance. Expected resolution: 3-5 days.',
      createdAt: '2026-01-22T14:20:00Z'
    }
  ],
  2: [
    {
      id: 3,
      complaintId: 2,
      user: { id: 1, name: 'John Doe' },
      text: 'This is causing flooding in my basement. Please prioritize!',
      createdAt: '2026-01-22T10:30:00Z'
    }
  ]
}

/**
 * Issue type options for the submission form
 */
export const issueTypes = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'drainage', label: 'Drainage Issue' },
  { value: 'streetlight', label: 'Street Light' },
  { value: 'road-blockage', label: 'Road Blockage' },
  { value: 'fallen-tree', label: 'Fallen Tree' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'waste', label: 'Waste Management' },
  { value: 'other', label: 'Other' }
]

/**
 * Department options for admin assignment
 */
export const departments = [
  'Road Maintenance Department',
  'Water Management',
  'Electrical Services',
  'Parks and Recreation',
  'Sanitation',
  'Public Works'
]
