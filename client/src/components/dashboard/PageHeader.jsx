export const PageHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    {action && (
      <button
        onClick={action.onClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
      >
        {action.icon && <action.icon className="w-4 h-4" />}
        {action.label}
      </button>
    )}
  </div>
);
