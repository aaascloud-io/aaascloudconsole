package jp.co.ifocus.commons.service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.GeolocationApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.CellTower;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.GeolocationPayload;
import com.google.maps.model.GeolocationPayload.GeolocationPayloadBuilder;
import com.google.maps.model.GeolocationResult;
import com.google.maps.model.LatLng;

import jp.co.ifocus.commons.config.ServerConfig;
import jp.co.ifocus.commons.config.ServerConfig.Keys;
import jp.co.ifocus.commons.log.MessageIdConstants;

public class GeoDecoderService {

    public final static GeoDecoderService INSTANCE = new GeoDecoderService();

    private Logger LOG = LoggerFactory.getLogger(GeoDecoderService.class);

    public static final String apiKey = ServerConfig.getDefualt().getString(Keys.GOOGLE_MAP_API_KEY, "AIzaSyCAbdPbKHzmq3_0QzDF7lCB0epBhcz3aNE");

    private static GeoApiContext context;

    private GeoDecoderService() {
    	if(context == null) {
    		context = new GeoApiContext.Builder().apiKey(apiKey).build();
    	}
    }

    public String getAddress(double lat, double lng) {
    	try {
			GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lng)).language("ja").await();
			for (GeocodingResult geocodingResult : results) {
				return geocodingResult.formattedAddress;
			}
		} catch (ApiException | InterruptedException | IOException e) {
			LOG.error(MessageIdConstants.W11064, lat, lng, e);
		}
    	return null;
    }

    public Location getLatLng(int cellId, int lac, int mcc, int mnc) {
    	GeolocationPayloadBuilder geolocationPayloadBuilder = new GeolocationPayloadBuilder();
    	CellTower cellTower = new CellTower();
    	cellTower.cellId = cellId;
    	cellTower.locationAreaCode = lac;
    	cellTower.mobileCountryCode = mcc;
    	cellTower.mobileNetworkCode = mnc;
    	geolocationPayloadBuilder.AddCellTower(cellTower);
    	GeolocationPayload requestPayload = geolocationPayloadBuilder.createGeolocationPayload();
    	try {
			GeolocationResult geolocationResult = GeolocationApi.geolocate(context, requestPayload).await();
			Location location = new Location();
			location.lat = geolocationResult.location.lat;
			location.lng = geolocationResult.location.lng;
			location.accuracy = geolocationResult.accuracy;
			return location;
		} catch (ApiException | InterruptedException | IOException e) {
			LOG.error(MessageIdConstants.W11065, cellId, lac, mcc, mnc, e);
		}
    	return null;
    }

    public class Location{
    	public double lat;
    	public double lng;
    	public double accuracy;
    }
}
