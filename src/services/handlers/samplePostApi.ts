import { geoNetworkClient } from '../../config/geoNetworkClient';

const getSamplePosts = async () => geoNetworkClient.get('posts');

export { getSamplePosts };
