import { useRef, useState } from "react";

interface SliderProps {
	beforeImage: string;
	afterImage: string;
}

export default function Slider({ beforeImage, afterImage }: SliderProps) {
	const [position, setPosition] = useState(50);
	const sliderRef = useRef<HTMLDivElement>(null);

	function updatePosition(event: { clientX: number }) {
		const slider = sliderRef.current;

		if (!slider) {
			return;
		}

		const bounds = slider.getBoundingClientRect();
		const nextPosition = ((event.clientX - bounds.left) / bounds.width) * 100;

		setPosition(Math.min(100, Math.max(0, nextPosition)));
	}

	return (
		<div
			ref={sliderRef}
			className="relative aspect-video w-full touch-none overflow-hidden select-none"
			onPointerDown={(event) => {
	event.currentTarget.setPointerCapture(event.pointerId);
	updatePosition(event);
}}
			onPointerMove={(event) => {
	if (event.currentTarget.hasPointerCapture(event.pointerId)) {
		updatePosition(event);
	}
}}
			
		>
			<img
				src={beforeImage}
				alt="Before"
				className="absolute inset-0 h-full w-full object-cover"
				draggable="false"
			/>

			<div
				className="absolute inset-y-0 left-0 overflow-hidden"
				style={{ width: `${position}%` }}
			>
				<img
					src={afterImage}
					alt="After"
					className="absolute inset-0 h-full w-full max-w-none object-cover"
					style={{ width: sliderRef.current?.clientWidth || "100%" }}
					draggable="false"
				/>
			</div>

			<button
				type="button"
				aria-label="Drag to compare images"
				className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize touch-none bg-white shadow-lg"
				style={{ left: `${position}%` }}
				onPointerDown={(event) => {
					event.currentTarget.setPointerCapture(event.pointerId);
					updatePosition(event);
				}}
				onPointerMove={(event) => {
					if (event.currentTarget.hasPointerCapture(event.pointerId)) {
						updatePosition(event);
					}
				}}
			>
				<span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm text-gray-700 shadow">
					↔
				</span>
			</button>
		</div>
	);
}
