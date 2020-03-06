import { TERM_PATTERN } from 'common/constants';

export const courses = [
  {
    title: 'Introduction to Computer Science',
    area: 'Computer Science',
    prefix: 'CS',
    number: '50',
    isUndergraduate: true,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: true,
  },
  {
    title: 'Advanced Scientific Computing: Numerical Methods',
    area: 'Applied Mathematics',
    prefix: 'AM',
    number: '205',
    isUndergraduate: false,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: true,
  },
  {
    title: 'Critical Thinking in Data Science',
    area: 'Applied Computation',
    prefix: 'AC',
    number: '221',
    isUndergraduate: false,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.SPRING,
    isSEAS: true,
  },
  {
    title: 'Data Science 1: Introduction to Data Science',
    area: 'Computer Science',
    prefix: 'CS',
    number: '109A',
    isUndergraduate: true,
    notes: '',
    private: false,
    sameAs: 'AC209A, Stats 121A',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: true,
  },
  {
    title: 'Data Science 2: Advancesd Topics in Data Science',
    area: 'Computer Science',
    prefix: 'CS',
    number: '109B',
    isUndergraduate: true,
    notes: '',
    private: false,
    sameAs: 'AC209B, Stats 121B',
    termPattern: TERM_PATTERN.Spring,
    isSEAS: true,
  },
  {
    title: 'Computational Physics of Solids and Fields',
    area: 'Applied Physics',
    prefix: 'AP',
    number: '278',
    isUndergraduate: false,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: true,
  },
  {
    title: 'Introduction to Biomedical Imaging and Systems',
    area: 'Bioengineering',
    prefix: 'BE',
    number: '128',
    isUndergraduate: true,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.SPRING,
    isSEAS: true,
  },
  {
    title: 'Introduction to Solid State Physics',
    area: 'Applied Physics',
    prefix: 'PHYSICS',
    number: '195',
    isUndergraduate: false,
    notes: '',
    private: false,
    sameAs: 'AP 195',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: false,
  },
  {
    title: 'Materials Selection',
    area: 'Materials Science and Mechanical Engineering',
    prefix: 'ES',
    number: '1XX',
    isUndergraduate: true,
    notes: '',
    private: true,
    sameAs: '',
    termPattern: TERM_PATTERN.BOTH,
    isSEAS: true,
  },
  {
    title: 'Computer-Aided Machine Design',
    area: 'Materials Science and Mechanical Engineering',
    prefix: 'ES',
    number: '51',
    isUndergraduate: true,
    notes: '',
    private: false,
    sameAs: '',
    termPattern: TERM_PATTERN.BOTH,
    isSEAS: true,
  },
  {
    title: 'IACS Seminar',
    area: 'Seminar',
    prefix: 'SEMINAR',
    number: 'IACS',
    isUndergraduate: false,
    notes: '',
    private: '',
    sameAs: '',
    termPattern: TERM_PATTERN.BOTH,
    isSEAS: true,
  },
  {
    title: 'Integrative Frameworks for Technology, Environment, and Society',
    area: 'Master in Design Engineering',
    prefix: 'PRO',
    number: '7231',
    isUndergraduate: false,
    notes: '',
    private: '',
    sameAs: '',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: false,
  },
  {
    title: 'Engineering the Acoustical World',
    area: 'Electrical Engineering',
    prefix: 'ES',
    number: '25',
    isUndergraduate: true,
    notes: '',
    private: '',
    sameAs: 'Gen Ed 1080',
    termPattern: TERM_PATTERN.FALL,
    isSEAS: true,
  },
];
