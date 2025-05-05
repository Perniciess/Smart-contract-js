export function NetworkErrorMessage({ message, dismiss }) {
	return (
		<div>
			{message}
			<button type="button" onClick={dismiss}>
				<span aria-hidden="true">ошибка</span>
			</button>
		</div>
	)
}