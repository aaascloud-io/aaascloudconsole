package com.ifocus.aaascloud.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import com.ifocus.aaascloud.constant.CommonConstant;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

public class HttpClient {
	   public String getUserInfo(String username, String password){
		      String userInfo = "";
		      String content="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
		                    +""; // 仮のPOST-body(XML)
		      try{
		    	 // Token取得
				JSONObject json = (JSONObject) JSONSerializer.toJSON(getToken(username,password));
				String accessToken = json.getString(CommonConstant.JSON_KEY_ACCESS_TOKEN);

		         // アドレス設定、ヘッダー情報設定
		         URL url = new URL(CommonConstant.AUTH_SERVER_PREFIX + CommonConstant.COMMAND_GET_UID);
		         HttpURLConnection con = (HttpURLConnection)url.openConnection();
		         con.setRequestMethod("GET");         // GET
				 con.setDoOutput(true);               // データを後ろに付ける
		         con.setInstanceFollowRedirects(false);// 勝手にリダイレクトさせない
		         con.setRequestProperty("Authorization", "Bearer " + accessToken);
		         con.setRequestProperty("cache-control", "no-cache");
				 con.setRequestProperty("Accept", "application/json");
				 con.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
		         con.connect();
		         // 送信
		         PrintWriter pw = new PrintWriter(new BufferedWriter(
		                                    new OutputStreamWriter(
		                                       con.getOutputStream()
		                                       ,"utf-8")));
		         pw.print(content);// content
		         pw.close();       // closeで送信完了
		         // body部の文字コード取得
		         String contentType = con.getHeaderField("Content-Type");
		         String charSet     = "Shift-JIS";//"ISO-8859-1";
		         if (contentType != null) {
			         for(String elm : contentType.replace(" ", "").split(";")) {
			            if (elm.startsWith("charset=")) {
			                charSet = elm.substring(8);
			                break;
		                }
		             }
		         }
		         // body部受信
		         BufferedReader br;
		         try{
		            br = new BufferedReader(new InputStreamReader(
		                                con.getInputStream(),charSet));
		            }
		         catch(Exception e_){
		            System.out.println( con.getResponseCode()
		                               +" "+ con.getResponseMessage() );
			        br = new BufferedReader(new InputStreamReader(
		                                  con.getErrorStream(),charSet));
		            }
		         String line;
		         while ((line = br.readLine()) != null) {
		            System.out.println(line+"\n");
		            userInfo = userInfo + line;
		            }
		         br.close();
		         con.disconnect();
		         }
		      catch(Exception e){
		         e.printStackTrace(System.err);
		         }
		      return userInfo;
		      }

	public String getToken(String username, String password){
		String token = "";
		try{
			// SSL証明書の検証を無視する
			disableSSLCertificateChecking();

			// アドレス設定、ヘッダー情報設定
			URL url = new URL(CommonConstant.AUTH_SERVER_PREFIX + CommonConstant.COMMAND_GET_TOKEN);
			HttpURLConnection con = (HttpURLConnection)url.openConnection();
			con.setRequestMethod("POST");         // POST
			con.setDoOutput(true);               // POSTのデータを後ろに付ける
			con.setInstanceFollowRedirects(false);// 勝手にリダイレクトさせない
			con.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
			con.setRequestProperty("Accept", "application/json");
			con.setRequestProperty("cache-control", "no-cache");

			// Body parameter set
			Hashtable<String, String> myParam = new Hashtable<String, String>();
			myParam.put("grant_type", "password");
			myParam.put("username", username);
			myParam.put("password", password);
			myParam.put("client_id", "trackun");

			con.connect();
			// 送信
			PrintWriter pw = new PrintWriter(new BufferedWriter(
			                        new OutputStreamWriter(
			                           con.getOutputStream()
			                           ,"utf-8")));
			pw.print(getPostParamString(myParam));
			pw.close();       // closeで送信完了
			// body部の文字コード取得
			String contentType = con.getHeaderField("Content-Type");
			String charSet     = "Shift-JIS";//"ISO-8859-1";
			for(String elm : contentType.replace(" ", "").split(";")) {
				if (elm.startsWith("charset=")) {
				    charSet = elm.substring(8);
				    break;
				    }
			 }
			// body部受信
			BufferedReader br;
			try{
				br = new BufferedReader(new InputStreamReader(
			                    con.getInputStream(),charSet));
			} catch(Exception e_){
				System.out.println( con.getResponseCode()
				                   +" "+ con.getResponseMessage() );
				br = new BufferedReader(new InputStreamReader(
				                      con.getErrorStream(),charSet));
			}
			String line;
			while ((line = br.readLine()) != null) {
				// System.out.println(line+"\n");
				token = token + line;
			}
			br.close();
			con.disconnect();
		}  catch(Exception e){
			e.printStackTrace(System.err);
		}
		return token;
	}

	private static void disableSSLCertificateChecking() throws Exception {
        System.out.println("[WARN] *** SSLCertificate Checking DISABLED ***");

        // ホスト名の検証を行わない
        HostnameVerifier hv = new HostnameVerifier() {
                public boolean verify(String s, SSLSession ses) {
                        System.out.println("[WARN] *** HostnameVerifier DISABLED *** ");
                        return true;
                }
        };
        HttpsURLConnection.setDefaultHostnameVerifier(hv);
        // 証明書の検証を行わない
        KeyManager[] km = null;
        TrustManager[] tm = {
    		new X509TrustManager() {
                public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                }
                public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                }
                public X509Certificate[] getAcceptedIssuers() {
                        return null;
                }
    		}
        };
        SSLContext sslcontext = SSLContext.getInstance("SSL");
        sslcontext.init(km, tm, new SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sslcontext.getSocketFactory());
	}

	private static String getPostParamString(Hashtable<String, String> params) {
	    if(params.size() == 0)
	        return "";

	    StringBuffer buf = new StringBuffer();
	    Enumeration<String> keys = params.keys();
	    while(keys.hasMoreElements()) {
	        buf.append(buf.length() == 0 ? "" : "&");
	        String key = keys.nextElement();
	        buf.append(key).append("=").append(params.get(key));
	    }
	    return buf.toString();
	}

}
