import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export default {
  methods: {
    isEmptyObject(value) {
      return Object.keys(value).length === 0;
    },

    dateFormat(date, format = 'YYYY-MM-DD HH:mm:ss') {
      if (!date) {
        return;
      }
      return dayjs(date).format(format);
    },

    dateFromNow(date) {
      dayjs.extend(relativeTime);

      return dayjs(date).fromNow();
    },
  },
};
