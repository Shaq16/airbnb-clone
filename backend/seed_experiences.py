import json
from app.database import SessionLocal
from app.models import Experience

# 20 completely unique Unsplash image lists to simulate dynamic data
MOCK_PHOTOS = [
    # 1. Delhi Heritage Walk
    [
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80"
    ],
    # 2. Jaipur Artisan Workshop
    [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    ],
    # 3. Mumbai Cinema Tour
    [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80"
    ],
    # 4. Kolkata Street Art
    [
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    ],
    # 5. Mumbai Street Food
    [
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80"
    ],
    # 6. Spice Market Cooking
    [
        "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80"
    ],
    # 7. Kerala Fish Fry
    [
        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"
    ],
    # 8. Rajasthani Thali
    [
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    ],
    # 9. Scuba Diving Goa
    [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80"
    ],
    # 10. Tea Plantation Munnar
    [
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80"
    ],
    # 11. Backwater Cruise Alleppey
    [
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80"
    ],
    # 12. Yoga Rishikesh
    [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=600&q=80"
    ],
    # 13. Trekking Manali
    [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80"
    ],
    # 14. Haveli Dinner Jaipur
    [
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80"
    ],
    # 15. Kathakali Dance Kochi
    [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=600&q=80"
    ],
    # 16. Coffee Plantation Coorg
    [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
    ],
    # 17. French Quarter Puducherry
    [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"
    ],
    # 18. Taj Mahal Photo Tour
    [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80"
    ],
    # 19. Desert Safari Jaisalmer
    [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=600&q=80"
    ],
    # 20. Himalayan Paragliding
    [
        "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
    ]
]

def seed_experiences():
    db = SessionLocal()
    try:
        # Clear existing to ensure fresh dynamic seed
        db.query(Experience).delete()

        # Detailed data for 20 completely unique experiences
        experiences_data = [
            {
                "id": 1,
                "title": "Heritage Walk in Old Delhi",
                "description": "Step back in time as we wander through the ancient alleys of Chandni Chowk. Visit centuries-old spice markets, grand Havelis, and historic mosques, tasting local delicacies along the way.",
                "category": "History Tour",
                "location_name": "Old Delhi, Delhi",
                "price": 1200,
                "duration": "3 hours",
                "host_name": "Rahul Kumar",
                "host_title": "Old Delhi Historian",
                "host_bio": "Rahul has lived in Chandni Chowk all his life and loves telling the untold stories of the Mughal empire.",
                "host_avatar": "🧑"
            },
            {
                "id": 2,
                "title": "Jaipur Artisan Workshop",
                "description": "Learn the ancient art of hand block printing from master artisans in Jaipur. You will design, carve, and print your own custom fabrics using traditional organic vegetable dyes.",
                "category": "Crafts Workshop",
                "location_name": "Jaipur, Rajasthan",
                "price": 950,
                "duration": "2.5 hours",
                "host_name": "Priya Sharma",
                "host_title": "Master Textile Designer",
                "host_bio": "Priya is a textile graduate dedicated to keeping the authentic block printing techniques alive.",
                "host_avatar": "👩‍🎨"
            },
            {
                "id": 3,
                "title": "Mumbai Cinema Tour",
                "description": "Discover the magic of Bollywood in the heart of Mumbai. Tour dynamic production studios, watch live film shootings, record your own voiceover tracks, and learn classic Bollywood dance moves.",
                "category": "Entertainment",
                "location_name": "Mumbai, Maharashtra",
                "price": 1500,
                "duration": "4 hours",
                "host_name": "Arjun Mehta",
                "host_title": "Bollywood Director & Producer",
                "host_bio": "Arjun has worked in the Hindi film industry for 15 years, directing multiple short films.",
                "host_avatar": "🎬"
            },
            {
                "id": 4,
                "title": "Kolkata Street Art Trail",
                "description": "Explore the vibrant murals, graffiti, and historic buildings of North Kolkata. Discover how contemporary visual artists are using street walls to reflect the city's complex social history.",
                "category": "Art & Design",
                "location_name": "Kolkata, West Bengal",
                "price": 800,
                "duration": "2 hours",
                "host_name": "Meena Das",
                "host_title": "Visual Artist & Activist",
                "host_bio": "Meena is a local muralist who coordinates the yearly Kolkata street culture festival.",
                "host_avatar": "🎨"
            },
            {
                "id": 5,
                "title": "Mumbai Street Food Tour",
                "description": "Savor Mumbai's legendary street snacks. From fiery Vada Pavs in Dadar to decadent Pav Bhaji in Juhu, we will taste 10+ legendary local food items at historical, hygienic local stalls.",
                "category": "Food & Drink",
                "location_name": "Mumbai, Maharashtra",
                "price": 1800,
                "duration": "3 hours",
                "host_name": "Vikram Shah",
                "host_title": "Food Journalist & Culinary Host",
                "host_bio": "Vikram writes food reviews for local dailies and knows the secret stories behind Mumbai's best stalls.",
                "host_avatar": "🌮"
            },
            {
                "id": 6,
                "title": "Spice Market and Cooking Class",
                "description": "Visit Asia's largest spice market to procure fresh herbs, then cook an authentic North Indian meal in a traditional family home. Master the delicate art of home spice-blending.",
                "category": "Cooking",
                "location_name": "New Delhi, Delhi",
                "price": 2200,
                "duration": "4 hours",
                "host_name": "Anita Roy",
                "host_title": "Traditional Home Chef",
                "host_bio": "Anita loves hosting travelers in her home kitchen, sharing secret family curry recipes passed down for generations.",
                "host_avatar": "🍳"
            },
            {
                "id": 7,
                "title": "Kerala Backwater Fish Fry & Dining",
                "description": "Dine on a traditional houseboat while floating down the serene lagoons of Kochi. Savor fresh pearl spot fish marinated in spicy local masala and grilled in banana leaves, served with coconut rice.",
                "category": "Dining Experience",
                "location_name": "Kochi, Kerala",
                "price": 1400,
                "duration": "3.5 hours",
                "host_name": "Thomas Varghese",
                "host_title": "Houseboat Captain & Chef",
                "host_bio": "Thomas has sailed the Kerala backwaters for decades and cooks legendary traditional seafood meals.",
                "host_avatar": "⛵"
            },
            {
                "id": 8,
                "title": "Rajasthani Thali Making Class",
                "description": "Learn the complex preparation of a royal Rajasthani feast. Cook legendary items like Dal Baati Churma, Gatte ki Sabji, and rich garlic chutney from raw local ingredients.",
                "category": "Cooking Class",
                "location_name": "Jaipur, Rajasthan",
                "price": 1100,
                "duration": "2 hours",
                "host_name": "Geeta Verma",
                "host_title": "Royal Kitchen Specialist",
                "host_bio": "Geeta teaches local heritage culinary arts at Jaipur's community institute.",
                "host_avatar": "🥗"
            },
            {
                "id": 9,
                "title": "Scuba Diving & Marine Exploration",
                "description": "Dive into the clear waters of Grand Island, Goa. Swim alongside sea turtles, corals, and vibrant reef fish under the supervision of professional PADI-certified dive instructors.",
                "category": "Water Sports",
                "location_name": "Grand Island, Goa",
                "price": 3500,
                "duration": "5 hours",
                "host_name": "Marcus D'Souza",
                "host_title": "PADI Master Instructor",
                "host_bio": "Marcus has logged over 4,000 dives and leads marine conservation projects along the Goan coast.",
                "host_avatar": "🤿"
            },
            {
                "id": 10,
                "title": "Tea Plantation & Processing Walk",
                "description": "Walk through Munnar's beautiful rolling tea estates. Learn the historical processing techniques of tea leaves, and sample organic white, green, and black oolong tea varieties in a scenic tasting room.",
                "category": "Nature Trail",
                "location_name": "Munnar, Kerala",
                "price": 999,
                "duration": "3 hours",
                "host_name": "Rohan Nair",
                "host_title": "Tea Sommelier & Botanist",
                "host_bio": "Rohan studies botanical agriculture and runs tea-tasting seminars across South India.",
                "host_avatar": "🍵"
            },
            {
                "id": 11,
                "title": "Houseboat Cruise & Toddy Tasting",
                "description": "Cruise down Alleppey's quiet backwaters in a traditional Kettuvallam. Stop at local islands to taste freshly tapped palm toddy (coconut wine) and home-cooked spicy clam stir-fry.",
                "category": "Boat Cruise",
                "location_name": "Alleppey, Kerala",
                "price": 2500,
                "duration": "4 hours",
                "host_name": "Babu Joseph",
                "host_title": "Local Island Guide",
                "host_bio": "Babu grew up on a remote backwater island and knows all the best local toddy shops.",
                "host_avatar": "🛥️"
            },
            {
                "id": 12,
                "title": "Yoga & Meditation by the Ganges",
                "description": "Experience inner peace at sunrise on the banks of the sacred Ganges river in Rishikesh. Practice traditional Hatha yoga postures and breathing meditation techniques.",
                "category": "Wellness",
                "location_name": "Rishikesh, Uttarakhand",
                "price": 1200,
                "duration": "2 hours",
                "host_name": "Swami Devendra",
                "host_title": "Yoga Acharya & Philosopher",
                "host_bio": "Swami Devendra has studied yogic sciences in Himalayan ashrams for over 20 years.",
                "host_avatar": "🧘"
            },
            {
                "id": 13,
                "title": "Snow Trekking in Solang Valley",
                "description": "Trek through snow-laden pine forests in Solang Valley. Enjoy panoramic views of the Majestic Himalayan peaks, learn winter survival basics, and warm up with hot noodle soups at basecamp.",
                "category": "Adventure Trekking",
                "location_name": "Manali, Himachal Pradesh",
                "price": 2800,
                "duration": "6 hours",
                "host_name": "Devinder Thakur",
                "host_title": "Himalayan Mountaineering Guide",
                "host_bio": "Devinder is a certified mountaineer who has climbed major peaks in the Karakoram range.",
                "host_avatar": "🥾"
            },
            {
                "id": 14,
                "title": "Heritage Haveli Dinner & Puppet Show",
                "description": "Dine like royalty inside a beautifully restored heritage Haveli. Enjoy classic Rajasthani music, Kathputli puppet shows, and a multi-course dinner of local Delicacies.",
                "category": "Heritage Dining",
                "location_name": "Jaipur, Rajasthan",
                "price": 2400,
                "duration": "3 hours",
                "host_name": "Kunwar Pratap",
                "host_title": "Heritage Haveli Host",
                "host_bio": "Pratap is a descendant of the family that built this beautiful 18th-century structure.",
                "host_avatar": "🏰"
            },
            {
                "id": 15,
                "title": "Kathakali & Kalaripayattu Show",
                "description": "Witness the intense preparation, makeup arts, and dramatic performance of Kathakali dance, followed by the sword-and-shield combat demonstrations of Kalaripayattu martial arts.",
                "category": "Performing Arts",
                "location_name": "Kochi, Kerala",
                "price": 750,
                "duration": "2.5 hours",
                "host_name": "Madhavan Nair",
                "host_title": "Kathakali Master",
                "host_bio": "Madhavan has performed classical Kathakali across Europe and Asia for over 30 years.",
                "host_avatar": "🎭"
            },
            {
                "id": 16,
                "title": "Coffee Plantation Trail & Tasting",
                "description": "Explore organic Arabica and Robusta coffee estates in Coorg. Learn about harvesting, roasting, and brewing techniques, and enjoy a tasting session of specialty single-origin coffees.",
                "category": "Agriculture Trail",
                "location_name": "Coorg, Karnataka",
                "price": 1250,
                "duration": "3 hours",
                "host_name": "Kiran Appachu",
                "host_title": "Coffee Planter & Sommelier",
                "host_bio": "Kiran runs a third-generation organic estate focusing on sustainable shade-grown coffee.",
                "host_avatar": "☕"
            },
            {
                "id": 17,
                "title": "French Quarter Cycle Tour",
                "description": "Cycle past the beautiful yellow-walled French mansions, quiet parks, and beachfront promenades of Puducherry. Learn about the city's unique dual colonial heritage.",
                "category": "Bicycle Tour",
                "location_name": "Puducherry",
                "price": 850,
                "duration": "2 hours",
                "host_name": "Pierre Dupont",
                "host_title": "Heritage Historian",
                "host_bio": "Pierre studies Indo-French colonial architecture and curates regional history walks.",
                "host_avatar": "🚲"
            },
            {
                "id": 18,
                "title": "Taj Mahal Sunrise Photography",
                "description": "Capture the iconic Taj Mahal at sunrise from the best hidden viewpoints across the Yamuna River. Learn pro tips for landscape lighting, composition, and long-exposure photography.",
                "category": "Photography",
                "location_name": "Agra, Uttar Pradesh",
                "price": 1950,
                "duration": "3 hours",
                "host_name": "Aman Qureshi",
                "host_title": "Professional Photographer",
                "host_bio": "Aman is a National Geographic contributor specializing in architectural heritage photography.",
                "host_avatar": "📷"
            },
            {
                "id": 19,
                "title": "Desert Safari & Star Gazing",
                "description": "Ride camels over the rolling sand dunes of the Thar desert. Enjoy traditional Rajasthani folk music by a campfire, followed by a professional guided telescope star-gazing session under dark skies.",
                "category": "Desert Tour",
                "location_name": "Jaisalmer, Rajasthan",
                "price": 3200,
                "duration": "6 hours",
                "host_name": "Habib Khan",
                "host_title": "Desert Explorer",
                "host_bio": "Habib belongs to a local nomadic tribe and knows the Jaisalmer sands like the back of his hand.",
                "host_avatar": "🐪"
            },
            {
                "id": 20,
                "title": "Himalayan Paragliding Bir Billing",
                "description": "Soar over the beautiful Dhauladhar mountain range in Bir Billing, Asia's highest paragliding site. Experience a tandem flight with GoPro recording included.",
                "category": "Air Sports",
                "location_name": "Bir Billing, Himachal Pradesh",
                "price": 4500,
                "duration": "2 hours",
                "host_name": "Ramesh Bhandari",
                "host_title": "Tandem Pilot",
                "host_bio": "Ramesh is a national paragliding champion with over 12 years of accident-free flying.",
                "host_avatar": "🪂"
            }
        ]

        for idx, ed in enumerate(experiences_data):
            photos = MOCK_PHOTOS[idx]
            exp = Experience(
                id=ed["id"],
                title=ed["title"],
                description=ed["description"],
                category=ed["category"],
                location_name=ed["location_name"],
                address=f"{ed['location_name']}, India",
                duration=ed["duration"],
                languages="English, Hindi",
                price=ed["price"],
                host_name=ed["host_name"],
                host_title=ed["host_title"],
                host_bio=ed["host_bio"],
                host_avatar=ed["host_avatar"],
                photos=json.dumps(photos),
                what_you_do=json.dumps([
                    {"title": "Meet & Greet", "desc": "Meet your local expert host at the starting location.", "img": photos[0]},
                    {"title": "Main Event", "desc": "Embark on the core experience and learn local techniques.", "img": photos[1] if len(photos) > 1 else photos[0]},
                    {"title": "Wrap Up", "desc": "Review what you learned, grab snacks, and take commemorative pictures.", "img": photos[2] if len(photos) > 2 else photos[0]}
                ]),
                reviews=json.dumps([
                    {
                        "name": "Jane",
                        "avatar": "👩",
                        "location": "San Francisco, CA",
                        "rating": 5,
                        "date": "2 days ago",
                        "text": f"This was the highlight of my trip to India! {ed['host_name']} was fantastic and incredibly informative."
                    },
                    {
                        "name": "Amit",
                        "avatar": "A",
                        "location": "Mumbai, India",
                        "rating": 5,
                        "date": "1 week ago",
                        "text": "Highly recommend. Extremely authentic and great value for money."
                    }
                ])
            )
            db.add(exp)
        
        db.commit()
        print("Successfully seeded all 20 unique experiences to SQLite DB with dynamic data!")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_experiences()
