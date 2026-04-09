import {Link} from 'react-router';

/**
 * @param {{videoSrc: string}} props
 */
export function HomeHeroSection({videoSrc}) {
  return (
    <section className="relative">
      <video
        autoPlay
        className="aspect-video z-[1] md:max-h-[900px] md:h-auto h-[640px] object-cover w-full object-top"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="z-[3] absolute md:bottom-[50px] bottom-10 w-full text-white">
        <div className="max-w-[1440px] w-full mx-auto xl:px-16 md:px-10 px-4 flex flex-col items-start md:gap-6 gap-5">
          <h1 className="md:max-w-[520px] lg:text-4xl text-2xl font-playfair uppercase md:leading-[40px] leading-[120%]">
            НАТУРАЛЬНІ КОРМИ ТА ЛАСОЩІ ДЛЯ ВАШОГО КОТА
          </h1>
          <p className="md:max-w-[590px] lg:text-base text-sm">
            Коти за своєю природою м&apos;ясоїдні, тому включення м&apos;яса і
            морепродуктів до їх раціону допомагає задовольнити їх природні
            потреби
          </p>
          <div className="flex gap-6 items-center">
            <Link
              className="hover:bg-[#c4252a] cursor-pointer hover:text-white w-[150px] h-[45px] border border-white bg-white text-black flex justify-center items-center"
              to="/collections/all"
            >
              Каталог
            </Link>
            <Link
              className="hover:bg-[#c4252a] cursor-pointer w-[150px] h-[45px] border border-white bg-transparent flex justify-center items-center"
              to="/collections"
            >
              Де купити?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
