// Import Dependencies
import PropTypes from "prop-types";
import {
  EllipsisHorizontalIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Chart from "react-apexcharts";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Avatar, Button, Card } from "components/ui";
// import { getChartConfig } from "./chartConfig";

// ----------------------------------------------------------------------

const socialIcons = {
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

export function UserCard({
  branchName,
  avatar,
  cover,
  color,
  socialLinks,
  chartData,
  name,
  query = "query",
  location = branchName + " " + "Hyderabad",
  postsCount,
}) {
  const socialButtons = Object.entries(socialLinks).map(([label, link]) => ({
    label,
    Icon: socialIcons[label],
    link,
  }));

  return (
    <Card>
      <div className="h-24 rounded-t-lg bg-primary-500">
        <img
          src={cover}
          alt="cover"
          className="h-full w-full rounded-t-lg object-cover object-center"
        />
      </div>
      <div className="px-4 py-2 sm:px-5">
        <div className="flex justify-between gap-4">
          <Avatar
            size={20}
            name={name}
            src={avatar}
            initialColor={color}
            classNames={{
              root: "-mt-12",
              display: "border-2 border-white text-2xl dark:border-dark-700",
            }}
          />
          <div className="flex gap-2">
            {socialButtons.map((item) => (
              <Button
                key={item.label}
                color="primary"
                variant="soft"
                className="size-7 rounded-full"
                isIcon
                component="a"
                href={item.link}
                aria-label={item.label}
              >
                <item.Icon className="size-4" />
              </Button>
            ))}
          </div>
        </div>
        <h3 className="pt-2 text-lg font-medium text-gray-800 dark:text-dark-100">
          <Highlight query={query}>{name}</Highlight>
        </h3>
        <p className="text-xs">
          <Highlight query={query}>{location}</Highlight>
        </p>

        <div className="flex items-center space-x-3 py-3">
          <Chart
            type="donut"
            width="100%"
            height="160"
            series={[chartData[0], 100 - chartData[0]]} // [Present, Others]
            options={{
              labels: ['Present', 'Absent'],
              dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                  return opts.seriesIndex === 0 ? val.toFixed(1) + "%" : '';
                },
                style: {
                  fontSize: '14px',
                },
              },
              colors: [color, '#E2E8F0'], // Present + gray for Others
              legend: {
                show: false,
              },
              chart: {
                animations: { enabled: true },
              },
              tooltip: {
                enabled: true,
                y: {
                  formatter: function (val) {
                    return val.toFixed(1) + "%";
                  },
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: '75%',
                    labels: {
                      show: true,
                      name: {
                        show: true,
                        fontSize: '12px',
                        color: '#666',
                        offsetY: -10,
                      },
                      value: {
                        show: true,
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#333',
                        offsetY: 10,
                        formatter: function (val) {
                          return parseFloat(val).toFixed(1) + "%";
                        },
                      },
                      total: {
                        show: false,
                      },
                    },
                  },
                },
              },
            }}
          />



          <div className="w-3/12 text-center">
            <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
              {postsCount}
            </p>
            <p className="text-xs-plus">Attendance</p>
          </div>
        </div>

        <div className="flex justify-center space-x-3 py-3 ">
          <Button className="size-9 rounded-full" isIcon>
            <VideoCameraIcon className="size-4.5" />
          </Button>
          <Button className="size-9 rounded-full" isIcon>
            <ChatBubbleLeftIcon className="size-4.5" />
          </Button>
          <Button className="size-9 rounded-full" isIcon>
            <EllipsisHorizontalIcon className="size-4.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

UserCard.propTypes = {
  avatar: PropTypes.string,
  cover: PropTypes.string,
  color: PropTypes.string,
  socialLinks: PropTypes.object,
  chartData: PropTypes.array,
  name: PropTypes.string,
  query: PropTypes.string,
  location: PropTypes.string,
  postsCount: PropTypes.number,
  branchName: PropTypes.string,
};
