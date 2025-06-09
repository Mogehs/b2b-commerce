import { FaTwitter, FaInstagram, FaFacebook, FaStar, FaRegStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Ravi Kumar',
    title: 'Car Enthusiast',
    img: '/dashboardreview/r1.jpg',
    text: "The quality of these seat covers is outstanding. They fit perfectly and add a touch of luxury to my car's interior. Highly recommend!",
    link: 'https://twitter.com/ravikumar/status/1234567890',
    icon: <FaTwitter />,
    rating: 5,
  },
  {
    name: 'Anjali Sharma',
    title: 'Marketing Professional',
    img: '/dashboardreview/r2.jpg',
    text: "I love the customizable designs! I was able to choose the perfect color to match my car's interior. The material feels very durable.",
    link: 'https://www.instagram.com/p/1234567890',
    icon: <FaInstagram />,
    rating: 4,
  },
  {
    name: 'Fakhar Abbas',
    title: 'Software Developer',
    img: '/dashboardreview/r3.jpg',
    text: "These seat covers are a game-changer for long drives. The added padding and ergonomic design make a huge difference in comfort.",
    link: 'https://www.facebook.com/vijaysingh/posts/1234567890',
    icon: <FaFacebook />,
    rating: 3,
  },
  {
    name: 'Priya Fatima',
    title: 'Mobile Developer',
    img: '/dashboardreview/r4.jpg',
    text: "The installation was super easy, and the instructions were clear. My car looks and feels much more upscale now.",
    link: 'https://twitter.com/priyapatel/status/1234567890',
    icon: <FaTwitter />,
    rating: 4,
  },
  {
    name: 'Arjun Mehta',
    title: 'Manager',
    img: '/dashboardreview/r5.jpg',
    text: "Great value for money. The seat covers have a premium feel and have significantly improved the look of my car's interior.",
    link: 'https://www.instagram.com/p/1234567890',
    icon: <FaInstagram />,
    rating: 5,
  },
  {
    name: 'Sneha Rao',
    title: 'Product Designer',
    img: '/dashboardreview/r6.jpg',
    text: "Absolutely love these seat covers. They're stylish, comfortable, and were really easy to install. My car interior looks brand new!",
    link: 'https://www.facebook.com/sneharao/posts/1234567890',
    icon: <FaFacebook />,
    rating: 5,
  },
];

const ReviewsSection = () => {
  return (
    <section className="pb-12 mx-auto md:pb-20 max-w-7xl">
      <div className="py-4 text-center md:py-8">
        {/* <h4 className="text-2xl font-bold tracking-wide uppercase text-[#C9AF2F]">Reviews</h4> */}
        <p className="mt-2 tracking-tight text-[#C9AF2F] text-md">We have some fans.</p>
      </div>

      <div className="gap-8 space-y-8 md:columns-2 lg:columns-3">
        {testimonials.map(({ name, title, img, text, link, icon, rating }, idx) => (
          <div
            key={idx}
            className="p-8 bg-[#f1f1f1] border border-gray-100 shadow-xl rounded-xl shadow-gray-600/10 break-inside-avoid transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >

            <div className="flex gap-4 items-start">
              <img
                className="w-12 h-12 rounded-full"
                src={img}
                alt={`${name} avatar`}
                loading="lazy"
              />
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <h6 className="text-lg font-medium text-[#C9AF2F]">{name}</h6>
                  <p className="text-sm text-gray-500">{title}</p>
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 ml-4 text-lg"
                >
                  {icon}
                </a>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex mt-4 text-yellow-400">
              {[...Array(5)].map((_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
            </div>

            <p className="mt-6 text-gray-700">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
