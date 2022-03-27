import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { sleep } from "../web3";

const client = new ApolloClient({
	uri: "https://api-mumbai.lens.dev/",
	cache: new InMemoryCache(),
});

export const getChallenge = async (userAddress) => {
	const resp = await client.query({
		query: gql(
			`
       query($request: ChallengeRequest!) {
       challenge(request: $request) { text }
       }`
		),
		context: {
			headers: {
				// "x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				address: userAddress,
			},
		},
	});
	return resp.data.challenge.text;
};

export const getTokens = async (userAddress, signature) => {
	const resp = await client.mutate({
		mutation: gql(`
      mutation($request: SignedAuthChallenge!) {
        authenticate(request: $request) {
          accessToken
          refreshToken
        }
     }
    `),
		variables: {
			request: {
				address: userAddress,
				signature,
			},
		},
	});
	return resp.data.authenticate;
};

export const getProfiles = async (
	userAddresses = undefined,
	ids = undefined,
	handles = undefined
) => {
	const resp = await client.mutate({
		mutation: gql(`
      query($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        depatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
    `),
		variables: {
			request: {
				limit: 50,
				profileIds: ids,
				ownedBy: userAddresses,
				handles: handles,
			},
		},
	});
	console.log(resp.data.profiles.items);
	return resp.data.profiles.items;
};

export const createProfile = async (
	jwt,
	userAddress,
	handle,
	pictureURI,
	followFee
) => {
	const resp = await client.mutate({
		mutation: gql(
			`mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
            __typename
    }
 }`
		),
		context: {
			headers: {
				"x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				handle: handle + ".avid",
				profilePictureUri: pictureURI,
				followModule: {
					feeFollowModule:
						followFee === 0
							? undefined
							: {
									amount: {
										currency:
											"0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
										value: `${
											followFee * Math.pow(10, 18)
										}`,
									},
									recipient: userAddress,
							  },
				},
			},
		},
	});
	console.log(resp);
	if (resp.data.reason !== undefined) {
		throw Error(
			`failed to make tx, error=${resp.data.createProfile.reason}`
		);
	}
	return resp.data.createProfile.txHash;
};

export const updateProfile = async (jwt, id, name, bio, twitterURL, stream) => {
	const resp = await client.mutate({
		mutation: gql(
			`
  mutation($request: UpdateProfileRequest!) { 
    updateProfile(request: $request) {
     id
    }
 }`
		),
		context: {
			headers: {
				"x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				profileId: id,
				name: name,
				bio: bio,
				website: stream,
				twitterUrl: twitterURL,
				coverPicture: null,
			},
		},
	});
	return resp.data.updateProfile.id;
};

export const checkProfileExists = async (userAddress) => {
	const resp = await getProfiles((userAddress = [userAddress]));
	for (const profile of resp) {
		if (profile.handle.endsWith(".avid")) return profile;
	}
};

export const createPost = async (jwt, id, userAddress, contentURI, amount) => {
	const resp = await client.mutate({
		mutation: gql(
			`
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleData
        referenceModule
        referenceModuleData
      }
     }
   }
 }
`
		),
		context: {
			headers: {
				"x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				profileId: id,
				contentURI: contentURI,
				collectModule: {
					revertCollectModule: amount == 0 ? true : false,
					feeCollectModule:
						amount == 0
							? undefined
							: {
									amount: {
										currency:
											"0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
										value: `${amount * Math.pow(10, 18)}`,
									},
									recipient: userAddress,
									referralFee: 0,
							  },
				},
				referenceModule: {
					followerOnlyReferenceModule: false,
				},
			},
		},
	});
	console.log(amount);
	return resp.data.createPostTypedData.typedData;
};

const hasTxBeenIndexed = (jwt, txHash) => {
	return client.query({
		query: gql(`
  query($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) { 
	    ... on TransactionIndexedResult {
            indexed
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
                }
            }
            metadataStatus {
              status
              reason
            }
        }
        ... on TransactionError {
            reason
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
             }
            }
        },
        __typename
    }
  }
`),
		context: {
			headers: {
				"x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				txHash,
			},
		},
		fetchPolicy: "network-only",
	});
};

export const pollUntilIndexed = async (jwt, txHash) => {
	while (true) {
		const result = await hasTxBeenIndexed(jwt, txHash);
		console.log("pool until indexed: result", result.data);

		const response = result.data.hasTxHashBeenIndexed;
		if (response.__typename === "TransactionIndexedResult") {
			console.log("pool until indexed: indexed", response.indexed);
			console.log(
				"pool until metadataStatus: metadataStatus",
				response.metadataStatus
			);

			if (response.metadataStatus) {
				if (response.metadataStatus.status === "SUCCESS") {
					return response;
				}

				if (
					response.metadataStatus.status ===
					"METADATA_VALIDATION_FAILED"
				) {
					throw new Error(response.metadataStatus.reason);
				}
			} else {
				if (response.indexed) {
					return response;
				}
			}

			console.log(
				"pool until indexed: sleep for 1500 milliseconds then try again"
			);
			// sleep for a second before trying again
			await sleep(1500);
		} else {
			// it got reverted and failed!
			throw new Error(response.reason);
		}
	}
};

export const getPublications = async (id, publicationTypes) => {
	const resp = await client.query({
		query: gql(`
  query($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    location
    website
    twitterUrl
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
     ... on Post {
        ...PostFields          
     }
     ... on Comment {
        ...CommentFields          
     }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
             ...PostFields          
          }
          ... on Comment {
             ...CommentMirrorOfFields        
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
         ...MirrorBaseFields
      }
    }
  }`),
		variables: {
			request: {
				profileId: id,
				publicationTypes,
				limit: 50,
			},
		},
		fetchPolicy: "network-only",
	});

	return resp.data.publications.items;
};

export const getPublication = async (id) => {
	const resp = await client.query({
		query: gql(`
  query($request: PublicationQueryRequest!) {
    publication(request: $request) {
        __typename 
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    location
    website
    twitterUrl
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
     ... on Post {
        ...PostFields          
     }
     ... on Comment {
        ...CommentFields          
     }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
             ...PostFields          
          }
          ... on Comment {
             ...CommentMirrorOfFields        
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
         ...MirrorBaseFields
      }
    }
  }
`),
		variables: {
			request: {
				publicationId: id,
			},
		},
		fetchPolicy: "network-only",
	});

	return resp.data.publication;
};

export const getTimeline = async (jwt, id) => {
	const resp = await client.query({
		query: gql(`
  query($request: TimelineRequest!) {
    timeline(request: $request) {
       items{
		    __typename 
        ... on Post {
          id
        }
        ... on Comment {
          id
        }
        ... on Mirror {
         id
      }
    }
	 pageInfo {
        prev
        next
        totalCount
      }
  }
}
`),
		context: {
			headers: {
				"x-access-token": jwt, // this header will reach the server
			},
		},
		variables: {
			request: {
				profileId: id,
				limit: 50,
			},
		},
		fetchPolicy: "network-only",
	});

	return resp.data.timeline.items;
};
