export function MainLogo() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 2.8a11.2 11.2 0 100 22.4 11.2 11.2 0 000-22.4z"
          fill="currentColor"
        />
      </svg>
      <span className="font-bold">Disaster Recovery QLD</span>
    </div>
  )
}
