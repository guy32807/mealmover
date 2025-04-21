// Mock restaurants data
export const mockRestaurants = [
  {
    id: '1',
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    description: 'Authentic Italian cuisine with homemade pasta and wood-fired pizzas.',
    address: '123 Main St, San Francisco, CA',
    phone: '(415) 555-1234',
    website: 'https://example.com/pasta-paradise',
    priceRange: 2,
    rating: 4.5,
    location: { lat: 37.7749, lng: -122.4194 },
    image: 'https://source.unsplash.com/random/800x600/?italian-food',
    deliveryTime: 25,
    deliveryFee: 3.99,
    offersDelivery: true,
    minimumOrder: 15,
    openingHours: '11:00 AM - 10:00 PM',
    menu: [
      {
        id: 'item1-1',
        name: 'Spaghetti Carbonara',
        description: 'Classic pasta with eggs, cheese, pancetta and black pepper',
        price: 14.99,
        image: 'https://source.unsplash.com/random/400x300/?pasta,carbonara',
        category: 'Pasta',
        popular: true
      },
      {
        id: 'item1-2',
        name: 'Margherita Pizza',
        description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        image: 'https://source.unsplash.com/random/400x300/?pizza,margherita',
        category: 'Pizza',
        popular: true
      },
      {
        id: 'item1-3',
        name: 'Caprese Salad',
        description: 'Fresh tomatoes, mozzarella, and basil with balsamic glaze',
        price: 9.99,
        image: 'https://source.unsplash.com/random/400x300/?salad,caprese',
        category: 'Appetizers',
        popular: false
      },
      {
        id: 'item1-4',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        image: 'https://source.unsplash.com/random/400x300/?dessert,tiramisu',
        category: 'Desserts',
        popular: true
      }
    ]
  },
  {
    id: '2',
    name: 'Sushi Dreams',
    cuisine: 'Japanese',
    description: 'Fresh sushi and sashimi prepared by master chefs.',
    address: '456 Market St, San Francisco, CA',
    phone: '(415) 555-5678',
    website: 'https://example.com/sushi-dreams',
    priceRange: 3,
    rating: 4.8,
    location: { lat: 37.7775, lng: -122.4164 },
    image: 'https://source.unsplash.com/random/800x600/?sushi',
    deliveryTime: 35,
    deliveryFee: 4.99,
    offersDelivery: true,
    minimumOrder: 20,
    openingHours: '12:00 PM - 9:30 PM',
    menu: [
      {
        id: 'item2-1',
        name: 'California Roll',
        description: 'Crab, avocado and cucumber roll',
        price: 8.99,
        image: 'https://source.unsplash.com/random/400x300/?sushi,california',
        category: 'Rolls',
        popular: true
      },
      {
        id: 'item2-2',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 6.99,
        image: 'https://source.unsplash.com/random/400x300/?sushi,salmon',
        category: 'Nigiri',
        popular: true
      },
      {
        id: 'item2-3',
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu and seaweed',
        price: 3.99,
        image: 'https://source.unsplash.com/random/400x300/?soup,miso',
        category: 'Soups',
        popular: false
      },
      {
        id: 'item2-4',
        name: 'Dragon Roll',
        description: 'Eel and cucumber roll topped with avocado',
        price: 12.99,
        image: 'https://source.unsplash.com/random/400x300/?sushi,dragon',
        category: 'Specialty Rolls',
        popular: true
      }
    ]
  },
  {
    id: '3',
    name: 'Taco Town',
    cuisine: 'Mexican',
    description: 'Authentic Mexican street food and margaritas.',
    address: '789 Mission St, San Francisco, CA',
    phone: '(415) 555-9012',
    website: 'https://example.com/taco-town',
    priceRange: 1,
    rating: 4.2,
    location: { lat: 37.7830, lng: -122.4075 },
    image: 'https://source.unsplash.com/random/800x600/?tacos',
    deliveryTime: 20,
    deliveryFee: 2.99,
    offersDelivery: true,
    minimumOrder: 10,
    openingHours: '10:00 AM - 11:00 PM',
    menu: [
      {
        id: 'item3-1',
        name: 'Carne Asada Tacos',
        description: 'Grilled steak tacos with onions and cilantro',
        price: 8.99,
        image: 'https://source.unsplash.com/random/400x300/?tacos,steak',
        category: 'Tacos',
        popular: true
      },
      {
        id: 'item3-2',
        name: 'Chicken Burrito',
        description: 'Large burrito with chicken, rice, beans, and cheese',
        price: 9.99,
        image: 'https://source.unsplash.com/random/400x300/?burrito,chicken',
        category: 'Burritos',
        popular: true
      },
      {
        id: 'item3-3',
        name: 'Guacamole & Chips',
        description: 'Fresh guacamole with homemade tortilla chips',
        price: 5.99,
        image: 'https://source.unsplash.com/random/400x300/?guacamole',
        category: 'Appetizers',
        popular: false
      },
      {
        id: 'item3-4',
        name: 'Classic Margarita',
        description: 'Tequila, lime juice, and triple sec',
        price: 7.99,
        image: 'https://source.unsplash.com/random/400x300/?margarita',
        category: 'Drinks',
        popular: true
      }
    ]
  },
  {
    id: '4',
    name: 'Curry House',
    cuisine: 'Indian',
    description: 'Flavorful curries and tandoori specialties.',
    address: '101 Powell St, San Francisco, CA',
    phone: '(415) 555-3456',
    website: 'https://example.com/curry-house',
    priceRange: 2,
    rating: 4.0,
    location: { lat: 37.7851, lng: -122.4071 },
    image: 'https://source.unsplash.com/random/800x600/?curry',
    deliveryTime: 40,
    deliveryFee: 3.49,
    offersDelivery: true,
    minimumOrder: 15,
    openingHours: '11:30 AM - 10:00 PM',
    menu: [
      {
        id: 'item4-1',
        name: 'Chicken Tikka Masala',
        description: 'Grilled chicken in a creamy tomato sauce',
        price: 15.99,
        image: 'https://source.unsplash.com/random/400x300/?curry,chicken',
        category: 'Curries',
        popular: true
      },
      {
        id: 'item4-2',
        name: 'Vegetable Samosas',
        description: 'Pastries filled with spiced potatoes and peas',
        price: 6.99,
        image: 'https://source.unsplash.com/random/400x300/?samosa',
        category: 'Appetizers',
        popular: true
      },
      {
        id: 'item4-3',
        name: 'Garlic Naan',
        description: 'Flatbread with garlic and butter',
        price: 3.99,
        image: 'https://source.unsplash.com/random/400x300/?naan',
        category: 'Breads',
        popular: false
      },
      {
        id: 'item4-4',
        name: 'Mango Lassi',
        description: 'Yogurt drink blended with mango and cardamom',
        price: 4.99,
        image: 'https://source.unsplash.com/random/400x300/?lassi',
        category: 'Beverages',
        popular: true
      }
    ]
  }
];