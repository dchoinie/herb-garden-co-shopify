import Container from "./container";
import Image from "next/image";

export default function Map() {
    return (
        <Container>
            <div className="flex">
                <div className="flex w-1/2">
                    <Image src="/map.webp" alt="Map" width={1000} height={1000} className="w-full h-full object-cover" />
                </div>
                <div className="flex w-1/2"></div>
            </div>
        </Container>
    )
}