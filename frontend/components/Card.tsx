const Card = ({ icon, title, description, category }: CardProps) => {
  return (
    <div className="cursor-pointer relative p-[2px] rounded-lg bg-gradient-to-r from-orange-400 to-red-400 h-full">
      <div className="w-full h-full p-6 bg-black rounded-lg flex flex-col">
        <div className="text-2xl absolute top-4 right-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 flex-grow">{description}</p>
        {category && (
          <span className="mt-4 text-normal text-orange-400 self-end">
            {category}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
