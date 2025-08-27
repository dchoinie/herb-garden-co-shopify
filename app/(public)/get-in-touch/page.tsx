import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function GetInTouch() {
  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 text-center">Get In Touch</h2>
        <p className="text-center mb-12">
          Reach out to us and let us know if there is anything we can do for
          you.
        </p>

        <form className="space-y-6 w-full flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="hidden">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Full Name"
              required
              className="border-gray-300 focus:border-primary focus:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="hidden">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              required
              className="border-gray-300 focus:border-primary focus:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="hidden">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Message"
              rows={8}
              required
              className="border-gray-300 focus:border-primary focus:ring-primary min-h-32"
            />
          </div>

          <Button
            type="submit"
            className="self-center rounded-full bg-main-green"
            size="lg"
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}
