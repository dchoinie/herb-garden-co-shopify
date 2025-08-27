import Container from "./container";

interface Testimonial {
    testimonial: string;
    gender: string;
    age: string;
    occupation: string;
}

export const testimonials: Testimonial[] = [
  {
    testimonial: "Your gummies worked better than anything I've tried to use to sleep before.",
    gender: "Male",
    age: "Mid 30s",
    occupation: "Sales Director"
  },
  {
    testimonial: "After 2 nights, this is definitely the best PM edible I have ever experienced.",
    gender: "Male",
    age: "Mid 30s",
    occupation: "Sales"
  },
  {
    testimonial: "Just wanted you to know how good I've been sleeping since using your gummies. I Most nights, I didn't even wak up. Honestly, I don't even remember stirring! The taste is also the best I've had yet.",
    gender: "Female",
    age: "Early 60s",
    occupation: "Surgery Admittance"
  },
  {
    testimonial: "My wife is a big fan of your SLEEP gummies. Nice work!",
    gender: "Female",
    age: "Early 40s",
    occupation: "Vice President"
  }
];

const TestimonialCard = ({ testimonial, gender, age, occupation }: Testimonial) => {
    return (
        <div className="flex flex-col text-white">
            <p className="text-xl mb-3">&quot;{testimonial}&quot;</p>
            <p>{gender} | {age} | {occupation}</p>
        </div>
    )
}

export default function Testimonials() {
    return (
        <div className="bg-main-green py-12">
            <Container>
                <div className="grid grid-cols-2 gap-6">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.testimonial} {...testimonial} />
                    ))}
                </div>
            </Container>
        </div>
    )
}